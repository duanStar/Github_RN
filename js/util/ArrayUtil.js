export default class ArrayUtil {
  static isEqual(arr1, arr2, key) {
    if (!(arr1 && arr2)) {
      return false;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if ((key && arr1[i][key] !== arr2[i][key]) || arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
  static updateArray(array, item, callback) {
    const index = array.findIndex(callback);
    if (index >= 0) {
      array.splice(index, 1);
      return;
    }
    array.push(item);
  }
  static removeItem(array, item, key) {
    if (!array) {
      return;
    }
    for (let i = 0; i < array.length; i++) {
      const val = array[i];
      if ((key && val[key] && val[key] === item[key]) || item === val) {
        array.splice(i, 1);
      }
    }
    return array;
  }
  static clone(from) {
    if (!from) {
      return [];
    }
    const res = [];
    from?.forEach((item, index) => {
      res[index] = item;
    });
    return res;
  }
  static findLastIndex(arr = [], callback) {
    for (let i = arr.length - 1; i >=0 ; i--) {
      if (callback(arr[i])) {
        return i;
      }
    }
    return -1;
  }
}
