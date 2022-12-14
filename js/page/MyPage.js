import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../common/NavigationBar';
import {MORE_MENU} from '../common/MORE_MENU';
import GlobalStyles from '../res/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import {useDispatch, useSelector} from 'react-redux';
import {onShowCustomThemeView} from '../action';

export default function MyPage({navigation}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.theme);
  const onClick = menu => {
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'Webview';
        params.title = '教程';
        params.url = 'https://www.reactnative.cn/docs/getting-started';
        break;
      case MORE_MENU.About:
        RouteName = 'About';
        break;
      case MORE_MENU.Feedback:
        const url = 'mailto://1715106673@qq.com';
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log(`Cant not handle url: ${url}`);
            } else {
              Linking.openURL(url);
            }
          })
          .catch(err => console.error(err));
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMe';
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKey';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag =
          menu === MORE_MENU.Custom_Language
            ? FLAG_LANGUAGE.flag_language
            : FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Key:
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKey';
        params.flag =
          menu === MORE_MENU.Sort_Key
            ? FLAG_LANGUAGE.flag_key
            : FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Theme:
        dispatch(onShowCustomThemeView(true));
        break;
      case MORE_MENU.CodePush:
        RouteName = 'CodePush';
        break;
    }
    if (RouteName) {
      navigation.navigate(RouteName, params);
    }
  };
  const getItem = menu => {
    return ViewUtil.getMenuItem(() => onClick(menu), menu, theme.themeColor);
  };
  return (
    <View style={GlobalStyles.rootContainer}>
      <NavigationBar
        title={'我的'}
        statusBar={{
          backgroundColor: theme.themeColor,
          barStyle: 'light-content',
        }}
        rightButton={ViewUtil.getSearchButton(() => {
          navigation.navigate('Search');
        })}
        style={{
          backgroundColor: theme.themeColor,
        }}
      />
      <ScrollView horizontal={false}>
        <TouchableOpacity
          onPress={() => onClick(MORE_MENU.About)}
          style={styles.item}>
          <View style={styles.aboutLeft}>
            <Ionicons
              name={MORE_MENU.About.icon}
              size={40}
              style={{marginRight: 10, color: theme.themeColor}}
            />
            <Text>Github Popular</Text>
          </View>
          <Ionicons
            name={'ios-arrow-forward'}
            size={16}
            style={{
              marginRight: 10,
              alignSelf: 'center',
              color: theme.themeColor,
            }}
          />
        </TouchableOpacity>
        <View style={GlobalStyles.line} />
        {getItem(MORE_MENU.Tutorial)}
        <Text style={styles.groupTitle}>趋势管理</Text>
        {/*自定义语言*/}
        {getItem(MORE_MENU.Custom_Language)}
        <View style={GlobalStyles.line} />
        {/*语音排序*/}
        {getItem(MORE_MENU.Sort_Language)}
        <Text style={styles.groupTitle}>最热管理</Text>
        {/*自定义标签*/}
        {getItem(MORE_MENU.Custom_Key)}
        <View style={GlobalStyles.line} />
        {/*标签排序*/}
        {getItem(MORE_MENU.Sort_Key)}
        <View style={GlobalStyles.line} />
        {/*标签移除*/}
        {getItem(MORE_MENU.Remove_Key)}
        <Text style={styles.groupTitle}>设置</Text>
        {/*自定义主题*/}
        {getItem(MORE_MENU.Custom_Theme)}
        <View style={GlobalStyles.line} />
        {/*关于作者*/}
        {getItem(MORE_MENU.About_Author)}
        <View style={GlobalStyles.line} />
        {/*反馈*/}
        {getItem(MORE_MENU.Feedback)}
        <View style={GlobalStyles.line} />
        {getItem(MORE_MENU.CodePush)}
      </ScrollView>
    </View>
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
  aboutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    height: 90,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
  },
});
