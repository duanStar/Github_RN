import ProjectModel from '../mo/ProjectModel';
import Utils from '../util/Utils';

export function handleData(
  actionType,
  dispatch,
  storeName,
  data,
  pageSize,
  favoriteDao,
  params,
) {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else {
      fixItems = data.data?.items || [];
    }
  }
  const showItems =
    pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
  _projectModels(showItems, favoriteDao, projectModes => {
    dispatch({
      type: actionType,
      projectModes,
      storeName,
      pageIndex: 2,
      items: fixItems,
      ...params,
    });
  });
}

export async function _projectModels(showItems, favoriteDao, callback) {
  try {
    const keys = await favoriteDao.getFavoriteKeys();
    const projectModels = showItems.map(
      item => new ProjectModel(item, Utils.checkFavorite(item, keys)),
    );
    if (typeof callback === 'function') {
      callback(projectModels);
    }
  } catch (err) {
    console.log(err);
  }
}
