import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor(flag) {
    this.favriteKey = FAVORITE_KEY_PREFIX + flag;
  }
  setFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, JSON.stringify(value), (err, res) => {
      if (!err) {
        this.updateFavoriteKeys(key, true);
      }
    });
  }

  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favriteKey, (err, res) => {
      if (!err) {
        let favoriteKeys = [];
        if (res) {
          favoriteKeys = JSON.parse(res);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {
          index === -1 && favoriteKeys.push(key);
        } else {
          index !== -1 && favoriteKeys.splice(index, 1);
        }
        AsyncStorage.setItem(this.favriteKey, JSON.stringify(favoriteKeys));
      }
    });
  }
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favriteKey, (err, res) => {
        if (!err) {
          try {
            resolve(JSON.parse(res));
          } catch (error) {
            reject(error);
          }
        } else {
          reject(err);
        }
      });
    });
  }
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (err, res) => {
      if (!err) {
        this.updateFavoriteKeys(key, false);
      }
    });
  }
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys()
        .then(keys => {
          let items = [];
          AsyncStorage.multiGet(keys, (err, res) => {
            if (!err) {
              try {
                res.map(item => {
                  const value = item[1];
                  if (value) {
                    items.push(JSON.parse(value));
                  }
                });
                resolve(items);
              } catch (error) {
                reject(error);
              }
            } else {
              reject(err);
            }
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
