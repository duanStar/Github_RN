import {FLAG_STORAGE} from '../expand/dao/DataStore';

export default class FavoriteUtil {
  static onFavorite(favoriteDao, item, isFavorite, flag) {
    const key =
      flag === FLAG_STORAGE.flag_trending ? item.repo : item.id?.toString();
    if (isFavorite) {
      favoriteDao.setFavoriteItem(key, item);
    } else {
      favoriteDao.removeFavoriteItem(key);
    }
  }
}
