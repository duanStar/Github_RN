import AsyncStorage from '@react-native-async-storage/async-storage';

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
  fetchData(url) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await this.fetchLocalData(url);
        if (data && DataStore.checkTimestampValid(data.timestamp)) {
          resolve(data);
        } else {
          data = await this.fetchNetData(url);
          resolve(this._wrapData(data));
        }
      } catch (err) {
        const data = await this.fetchNetData(url);
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
  fetchNetData(url) {
    return new Promise((resolve, reject) => {
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
    });
  }
}
