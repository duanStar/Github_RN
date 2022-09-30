import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeFactory, {ThemeFlags} from '../../res/styles/ThemeFactory';
export const THEME_KEY = 'theme_key';

export default class ThemeDao {
  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, res) => {
        if (error) {
          reject(error);
          return;
        }
        if (!res) {
          this.save(ThemeFlags.Default);
          res = ThemeFlags.Default;
        }
        resolve(ThemeFactory.createTheme(res));
      }).catch(err => {
        reject(err);
      });
    });
  }
  save(ThemeFlag) {
    AsyncStorage.setItem(THEME_KEY, ThemeFlag).catch(err => {
      console.error(err);
    });
  }
}
