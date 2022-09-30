import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import NavigationBar from '../common/NavigationBar';
import {onLoadLanguage} from '../action';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import ArrayUtil from '../util/ArrayUtil';
import SortableListView from 'react-native-sortable-listview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SortKeyPage({route, navigation}) {
  const {params} = route;
  const {flag} = params;
  const backPress = new BackPressComponent({
    backPress: () => onBackPress(),
  });
  const title = flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
  const [checkedArray, setCheckedArray] = useState([]);
  const sortedArray = useRef([]);
  const languageDao = new LanguageDao(flag);
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme.theme);
  const dispatch = useDispatch();
  useEffect(() => {
    backPress.componentDidMount();
    if (_keys().length === 0) {
      dispatch(onLoadLanguage(flag));
    }
    setCheckedArray(_keys());
    sortedArray.current = _keys();
    return () => backPress.componentWillUnmount();
  }, []);
  const onBackPress = () => {
    onBack();
    return true;
  };
  const onBack = () => {
    if (!ArrayUtil.isEqual(_keys(), checkedArray, 'name')) {
      Alert.alert('提示', '要保存修改吗?', [
        {
          text: '否',
          onPress: () => {
            navigation.goBack();
          },
        },
        {
          text: '是',
          onPress: () => {
            onSave(true);
          },
        },
      ]);
      return;
    }
    navigation.goBack();
  };
  const _keys = () => {
    const key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    return (language[key] || []).filter(item => item.checked);
  };
  const onSave = hasChecked => {
    if (!hasChecked) {
      if (ArrayUtil.isEqual(_keys(), checkedArray, 'name')) {
        return navigation.goBack();
      }
    }
    const sortResultArray = getSortResult();
    languageDao.save(sortResultArray);
    dispatch(onLoadLanguage(flag));
    navigation.goBack();
  };
  const getSortResult = () => {
    const key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    const sortResultArray = ArrayUtil.clone(language[key]);
    const originalCheckedArray = _keys();
    originalCheckedArray.forEach((item, index) => {
      const prevIndex = ArrayUtil.findLastIndex(
        sortResultArray,
        data => data.name === item.name,
      );
      sortResultArray.splice(prevIndex, 1, checkedArray[index]);
    });
    return sortResultArray;
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <NavigationBar
          title={title}
          statusBar={{
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
          }}
          rightButton={ViewUtil.getRightButton(() => onSave(true), '保存')}
          leftButton={ViewUtil.getLeftBackButton(onBack)}
          style={{
            backgroundColor: theme.themeColor,
          }}
        />
        <SortableListView
          data={checkedArray}
          order={Object.keys(checkedArray)}
          onRowMoved={e => {
            sortedArray.current.splice(
              e.to,
              0,
              sortedArray.current.splice(e.from, 1)[0],
            );
            setCheckedArray(sortedArray.current);
          }}
          renderRow={row => <SortCell data={row} {...params} />}
        />
      </View>
    </SafeAreaView>
  );
}

function SortCell({data, sortHandlers}) {
  const theme = useSelector(state => state.theme.theme);
  const {checked, name} = data;
  return (
    <TouchableHighlight
      underlayColor={'#eee'}
      style={checked ? styles.item : styles.hidden}
      {...sortHandlers}>
      <View style={{marginLeft: 10, flexDirection: 'row'}}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{marginRight: 10, color: theme.themeColor}}
        />
        <Text>{name}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabBarItemStyle: {
    // minWidth: 50,
  },
  tabBarIndicatorStyle: {
    height: 2,
    backgroundColor: '#fff',
  },
  tabBarLabelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: '#fff',
    margin: 10,
  },
  item: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
  hidden: {
    height: 0,
  },
});
