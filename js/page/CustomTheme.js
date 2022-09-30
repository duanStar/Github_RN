import {
  Modal,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableHighlight,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { onShowCustomThemeView, onThemeChange } from "../action";
import ThemeDao from '../expand/dao/ThemeDao';
import ThemeFactory, {ThemeFlags} from '../res/styles/ThemeFactory';

export default function CustomTheme() {
  const {showCustomThemeView} = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const themeDao = new ThemeDao();
  const renderThemeItems = () => {
    const views = [];
    const keys = Object.keys(ThemeFlags);
    for (let i = 0; i < keys.length; i += 3) {
      views.push(
        <View key={i} style={{flexDirection: 'row'}}>
          {getThemeItem(keys[i])}
          {getThemeItem(keys[i + 1])}
          {getThemeItem(keys[i + 2])}
        </View>,
      );
    }
    return views;
  };
  const getThemeItem = key => {
    return (
      <TouchableHighlight
        underlayColor={'#fff'}
        style={{flex: 1}}
        onPress={() => {
          themeDao.save(ThemeFlags[key]);
          dispatch(onThemeChange(ThemeFactory.createTheme(ThemeFlags[key])));
          dispatch(onShowCustomThemeView(false));
        }}>
        <View style={[{backgroundColor: ThemeFlags[key]}, styles.themeItem]}>
          <Text style={styles.themeText}>{key}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <Modal
      transparent={true}
      visible={showCustomThemeView}
      onRequestClose={() => dispatch(onShowCustomThemeView(false))}>
      <View style={styles.modalContainer}>
        <ScrollView>{renderThemeItems()}</ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 10,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: '#fff',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3,
    shadowOffset: {width: 2, height: 2},
  },
  themeItem: {
    flex: 1,
    width: 120,
    height: 120,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
