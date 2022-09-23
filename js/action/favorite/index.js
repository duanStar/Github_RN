import Types from '../types';
import FavoriteDao from '../../expand/dao/favoriteDao';
import ProjectModel from '../../mo/ProjectModel';

export function onLoadFavoriteData(flag, isShowLoading) {
  return dispatch => {
    if (isShowLoading) {
      dispatch({
        type: Types.POPULAR_REFRESH,
        storeName: flag,
      });
    }
    new FavoriteDao(flag)
      .getAllItems()
      .then(items => {
        const result = [];
        items.forEach(item => {
          result.push(new ProjectModel(item, true));
        });
        dispatch({
          type: Types.FAVORITE_LOAD_SUCCESS,
          projectModes: result,
          storeName: flag,
        });
      })
      .catch(err => {
        dispatch({
          type: Types.FAVORITE_LOAD_FAIL,
          storeName: flag,
          error: err,
        });
      });
  };
}
