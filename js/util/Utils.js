import {Dimensions, Platform} from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const {height: D_HEIGHT, width: D_WIDTH} = Dimensions.get('window');

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
  static isIPhoneX() {
    return (
      Platform.OS === 'ios' &&
      ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
        (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
    );
  }
}
