import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../common/NavigationBar';
import {MORE_MENU} from '../common/MORE_MENU';
import GlobalStyles from '../res/GlobalStyles';
import ViewUtil from '../util/ViewUtil';

const THEME_COLOR = '#007AFF';

export default function MyPage({navigation}) {
  const getRightButton = callback => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => callback && callback()}>
          <View style={{padding: 5, marginRight: 8}}>
            <Feather name={'search'} size={24} style={{color: '#fff'}} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
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
    }
    if (RouteName) {
      navigation.navigate(RouteName, params);
    }
  };
  const getItem = menu => {
    return ViewUtil.getMenuItem(() => onClick(menu), menu, THEME_COLOR);
  };
  return (
    <View style={GlobalStyles.rootContainer}>
      <NavigationBar
        title={'我的'}
        statusBar={{
          backgroundColor: THEME_COLOR,
          barStyle: 'light-content',
        }}
        rightButton={getRightButton()}
        style={{
          backgroundColor: THEME_COLOR,
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
              style={{marginRight: 10, color: THEME_COLOR}}
            />
            <Text>Github Popular</Text>
          </View>
          <Ionicons
            name={'ios-arrow-forward'}
            size={16}
            style={{marginRight: 10, alignSelf: 'center', color: THEME_COLOR}}
          />
        </TouchableOpacity>
        <View style={GlobalStyles.line} />
        {getItem(MORE_MENU.Tutorial)}
        <Text style={styles.groupTitle}>趋势管理</Text>
        {/*自定义语音*/}
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
        <Text style={styles.groupTitle}>设置</Text>
        {/*自定义主题*/}
        {getItem(MORE_MENU.Custom_Theme)}
        <View style={GlobalStyles.line} />
        {/*关于作者*/}
        {getItem(MORE_MENU.About_Author)}
        <View style={GlobalStyles.line} />
        {/*反馈*/}
        {getItem(MORE_MENU.Feedback)}
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
