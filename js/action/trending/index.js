import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil';

export function onRefreshTrending(
  storeName,
  url,
  pageSize = 10,
  params = {},
  favoriteDao,
) {
  return dispatch => {
    dispatch({
      type: Types.TRENDING_REFRESH,
      storeName: storeName,
    });
    let dateStore = DataStore.of();
    dateStore
      .fetchData(url, FLAG_STORAGE.flag_trending, params)
      .then(data => {
        handleData(
          Types.TRENDING_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
          favoriteDao,
        );
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: Types.TRENDING_REFRESH_FAIL,
          storeName,
          error: err,
        });
      });
  };
}

export function onLoadMoreTrending(
  storeName,
  pageIndex,
  pageSize = 10,
  dataArray = [],
  favoriteDao,
  callback,
) {
  return dispatch => {
    setTimeout(() => {
      if (pageIndex * pageSize > dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more data');
        }
        _projectModels(dataArray, favoriteDao, projectModes => {
          dispatch({
            type: Types.LOAD_TRENDING_MORE_FAIL,
            error: 'no more',
            storeName,
            pageIndex,
            projectModes,
          });
        });
      } else {
        const max =
          pageSize * pageIndex >= dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, projectModes => {
          dispatch({
            type: Types.LOAD_TRENDING_MORE_SUCCESS,
            storeName,
            pageIndex: ++pageIndex,
            projectModes,
          });
        });
      }
    }, 500);
  };
}
