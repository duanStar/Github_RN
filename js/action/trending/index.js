import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData} from '../ActionUtil';

export function onRefreshTrending(storeName, url, pageSize = 10, params = {}) {
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
  callback,
) {
  return dispatch => {
    setTimeout(() => {
      if (pageIndex * pageSize > dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more data');
        }
        dispatch({
          type: Types.LOAD_TRENDING_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex,
          projectModes: dataArray,
        });
      } else {
        const max =
          pageSize * pageIndex >= dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        dispatch({
          type: Types.LOAD_TRENDING_MORE_SUCCESS,
          storeName,
          pageIndex: ++pageIndex,
          projectModes: dataArray.slice(0, max),
        });
      }
    }, 500);
  };
}
