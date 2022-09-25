import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil {
  static getLeftBackButton(callback) {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={() => callback && callback()}>
        <Ionicons name={'ios-arrow-back'} size={26} style={{color: '#fff'}} />
      </TouchableOpacity>
    );
  }
  static getShareButton(callback) {
    return (
      <TouchableOpacity>
        <Ionicons
          name={'md-share'}
          size={20}
          style={{opacity: 0.9, marginRight: 10, color: '#fff'}}
        />
      </TouchableOpacity>
    );
  }
  static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
    return (
      <TouchableOpacity
        onPress={() => callback && callback()}
        style={styles.settingItemContainer}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          {Icons && icon ? (
            <Icons name={icon} size={16} style={{color, marginRight: 10}} />
          ) : (
            <View
              style={{opacity: 1, width: 16, height: 16, marginRight: 10}}
            />
          )}
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIco ? expandableIco : 'ios-arrow-forward'}
          size={16}
          style={{marginRight: 10, alignSelf: 'center', color: color || '#000'}}
        />
      </TouchableOpacity>
    );
  }

  static getMenuItem(callback, menu, color, expandableIco) {
    return ViewUtil.getSettingItem(
      callback,
      menu.name,
      color,
      menu.Icons,
      menu.icon,
      expandableIco,
    );
  }
}

const styles = StyleSheet.create({
  settingItemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
