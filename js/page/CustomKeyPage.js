import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, SafeAreaView, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import NavigationBar from '../common/NavigationBar';
import {onLoadLanguage} from '../action';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import CheckBox from 'react-native-check-box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrayUtil from '../util/ArrayUtil';

export default function CustomKeyPage({route, navigation}) {
  const {params} = route;
  const {isRemoveKey, flag} = params;
  const backPress = new BackPressComponent({
    backPress: () => onBackPress(),
  });
  let title = isRemoveKey ? '标签移除' : '自定义标签';
  title = flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
  const rightButtonTitle = isRemoveKey ? '移除' : '保存';
  const changeValues = useRef([]);
  const languageDao = new LanguageDao(flag);
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme.theme);
  const dispatch = useDispatch();
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    backPress.componentDidMount();
    if (_keys().length === 0) {
      dispatch(onLoadLanguage(flag));
    }
    setKeys(_keys());
    return () => backPress.componentWillUnmount();
  }, []);
  const onBackPress = () => {
    onBack();
    return true;
  };
  const onBack = () => {
    if (changeValues.current.length > 0) {
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
            onSave();
          },
        },
      ]);
      return;
    }
    navigation.goBack();
  };
  const _keys = original => {
    const key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    if (isRemoveKey && !original) {
      return keys.length
        ? keys.map(item => ({
            ...item,
            checked: false,
          }))
        : language[key]?.map(item => ({
            ...item,
            checked: false,
          }));
    } else {
      return language[key];
    }
  };
  const onSave = () => {
    if (changeValues.current.length === 0) {
      return navigation.goBack();
    }
    let newKeys;
    if (isRemoveKey) {
      newKeys = _keys(true);
      changeValues.current?.forEach(item => {
        ArrayUtil.removeItem(newKeys, item, 'name');
      });
    }
    languageDao.save(newKeys || keys);
    dispatch(onLoadLanguage(flag));
    navigation.goBack();
  };
  const onClick = (data, index) => {
    ArrayUtil.updateArray(
      changeValues.current,
      {
        ...data,
        checked: !data.checked,
      },
      item => item.name === data.name,
    );
    setKeys(
      keys.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            checked: !item.checked,
          };
        } else {
          return item;
        }
      }),
    );
  };
  const _checkedImage = checked => {
    return (
      <Ionicons
        name={checked ? 'ios-checkbox' : 'md-square-outline'}
        size={20}
        style={{color: theme.themeColor}}
      />
    );
  };
  const renderCheckBox = (data, index) => {
    return (
      <CheckBox
        isChecked={data.checked}
        onClick={() => onClick(data, index)}
        leftText={data.name}
        checkedImage={_checkedImage(true)}
        unCheckedImage={_checkedImage(false)}
        style={{
          padding: 10,
          flex: 1,
        }}
      />
    );
  };
  const renderView = () => {
    if (!keys || keys.length === 0) {
      return;
    }
    const len = keys.length;
    const views = [];
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {renderCheckBox(keys[i], i)}
            {i + 1 < len && renderCheckBox(keys[i + 1], i + 1)}
          </View>
          <View style={styles.line} />
        </View>,
      );
    }
    return views;
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
          rightButton={ViewUtil.getRightButton(
            () => onSave(),
            rightButtonTitle,
          )}
          leftButton={ViewUtil.getLeftBackButton(onBack)}
          style={{
            backgroundColor: theme.themeColor,
          }}
        />
        <ScrollView>{renderView()}</ScrollView>
      </View>
    </SafeAreaView>
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
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});
