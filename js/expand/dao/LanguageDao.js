import AsyncStorage from '@react-native-async-storage/async-storage';
import langs from '../../res/data/langs.json';
import keys from '../../res/data/keys.json';

export const FLAG_LANGUAGE = {
  flag_language: 'language_dao_language',
  flag_key: 'language_dao_key',
};
export default class LanguageDao {
  constructor(flag) {
    this.flag = flag;
  }
  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, res) => {
        if (error) {
          reject(error);
          return;
        }
        if (!res) {
          const data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
          this.save(data);
          resolve(data);
        } else {
          try {
            resolve(JSON.parse(res));
          } catch (e) {
            reject(e);
          }
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
  save(data) {
    AsyncStorage.setItem(this.flag, JSON.stringify(data)).catch(err => {
      console.error(err);
    });
  }
}
