export default class Utils {
  static checkFavorite(item, items = []) {
    if (!items) {
      return false;
    }
    return items.includes(item.id?.toString() || item.repo);
  }
}
