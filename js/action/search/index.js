import Types from '../types';
import {_projectModels, handleData} from '../ActionUtil';
import ArrayUtil from '../../util/ArrayUtil';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];

export function onSearch(
  inputKey,
  pageSize,
  token,
  favoriteDao,
  popularKeys,
  callback,
) {
  return dispatch => {
    dispatch({
      type: Types.SEARCH_REFRESH,
    });
    fetch(genFetchUrl(inputKey))
      .then(res => {
        return hasCancel(token) ? null : res.json();
      })
      .then(data => {
        if (hasCancel(token, true)) {
          return;
        }
        if (!data || !data.items || data.items?.length === 0) {
          dispatch({
            type: Types.SEARCH_FAIL,
            message: `没有找到关于${inputKey}的项目`,
          });
          callback && callback(`没有找到关于${inputKey}的项目`);
          return;
        }
        handleData(
          Types.SEARCH_REFRESH_SUCCESS,
          dispatch,
          '',
          {data},
          pageSize,
          favoriteDao,
          {
            showBottomButton: !checkKeyIsExist(popularKeys, inputKey),
            inputKey,
          },
        );
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: Types.SEARCH_FAIL,
          error: err,
        });
      });
  };
}

export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token);
    dispatch({
      type: Types.SEARCH_CANCEL,
    });
  };
}

export function onSearchMore(
  pageIndex,
  pageSize,
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
            type: Types.SEARCH_LOAD_MORE_FAIL,
            error: 'no more',
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
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex: ++pageIndex,
            projectModes,
          });
        });
      }
    }, 500);
  };
}

function genFetchUrl(key) {
  return API_URL + key + QUERY_STR;
}

function checkKeyIsExist(keys, key) {
  for (let i = 0; i < keys.length; i++) {
    if (key.toLowerCase() === keys[i].name.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.removeItem(CANCEL_TOKENS, token);
    return true;
  }
  return false;
}
