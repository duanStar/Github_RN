import AsyncStorage from '@react-native-async-storage/async-storage';

export const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
  flag_about_me: 'about_me',
};

export default class DataStore {
  static instance = new DataStore();
  static of() {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) {
      return false;
    }
    if (currentDate.getDate() !== targetDate.getDate()) {
      return false;
    }
    if (currentDate.getHours() - targetDate.getHours() > 4) {
      return false;
    }
    return true;
  }
  fetchData(url, flag, params = {}) {
    if (flag === FLAG_STORAGE.flag_trending) {
      let query = '';
      for (let key in params) {
        query += `${key}=${params[key]}&`;
      }
      url = `${url}?${query.substring(0, query.length - 1)}`;
    }
    return new Promise(async (resolve, reject) => {
      try {
        let data = await this.fetchLocalData(url);
        if (data && DataStore.checkTimestampValid(data.timestamp)) {
          resolve(data);
        } else {
          data = await this.fetchNetData(url, flag, params);
          resolve(this._wrapData(data));
        }
      } catch (err) {
        const data = await this.fetchNetData(url, flag, params).catch(err =>
          console.log(err),
        );
        resolve(this._wrapData(data));
      }
    });
  }
  saveData(url, data, callback) {
    if (!data || !url) {
      return;
    }
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }
  _wrapData(data) {
    return {data, timestamp: +new Date()};
  }
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (err, res) => {
        if (!err) {
          try {
            resolve(JSON.parse(res));
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(err);
          console.error(err);
        }
      });
    });
  }
  fetchNetData(url, flag, params) {
    return new Promise((resolve, reject) => {
      if (flag === FLAG_STORAGE.flag_popular) {
        fetch(url)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Network response was not ok');
          })
          .then(data => {
            this.saveData(url, data);
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        fetch(url)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Network response was not ok');
          })
          .then(data => {
            this.saveData(url, data.items);
            resolve(data.items);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }
}
