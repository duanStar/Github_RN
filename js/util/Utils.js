export default class Utils {
  static checkFavorite(item, items = []) {
    if (!items) {
      return false;
    }
    return items.includes(item.id?.toString() || item.repo);
  }
  static checkKeyIsExists(key, keys = []) {
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].name.toLowerCase() === key.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
}
