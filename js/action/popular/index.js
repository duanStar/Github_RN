import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

export function onRefreshPopularData(storeName, url, pageSize) {
  return dispatch => {
    dispatch({
      type: Types.POPULAR_REFRESH,
      storeName: storeName,
    });
    let dateStore = DataStore.of();
    dateStore
      .fetchData(url)
      .then(data => {
        handleData(dispatch, storeName, data, pageSize);
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
          storeName,
          error: err,
        });
      });
  };
}

export function onLoadMorePopular(
  storeName,
  pageIndex,
  pageSize,
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
          type: Types.LOAD_POPULAR_MORE_FAIL,
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
          type: Types.LOAD_POPULAR_MORE_SUCCESS,
          storeName,
          pageIndex: ++pageIndex,
          projectModes: dataArray.slice(0, max),
        });
      }
    }, 500);
  };
}

function handleData(dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data && data.data.items) {
    fixItems = data.data.items;
  }
  if (data) {
    dispatch({
      type: Types.POPULAR_REFRESH_SUCCESS,
      projectModes:
        pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
      storeName,
      pageIndex: 2,
      items: fixItems,
    });
  }
}
