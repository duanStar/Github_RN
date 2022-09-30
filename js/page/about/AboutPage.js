import React, {useState} from 'react';
import {Linking, View} from 'react-native';
import GlobalStyles from '../../res/GlobalStyles';
import AboutCommon from './AboutCommon';
import {FLAG_STORAGE} from '../../expand/dao/DataStore';
import configJson from '../../res/data/config.json';
import ViewUtil from '../../util/ViewUtil';
import {MORE_MENU} from '../../common/MORE_MENU';
import {useSelector} from 'react-redux';

export default function AboutPage({navigation, route}) {
  const theme = useSelector(state => state.theme.theme);
  const [config, setConfig] = useState(configJson);
  const aboutCommon = new AboutCommon(
    {
      ...route.params,
      navigation,
      flagAbout: FLAG_STORAGE.flag_about_me,
      theme,
    },
    ({data}) => setConfig({...data}),
  );
  const onClick = menu => {
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'Webview';
        params.title = '教程';
        params.url = 'https://www.reactnative.cn/docs/getting-started';
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
    return ViewUtil.getMenuItem(() => onClick(menu), menu, theme.themeColor);
  };
  const content = (
    <View>
      {getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line} />
      {getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line} />
      {getItem(MORE_MENU.Feedback)}
    </View>
  );
  return aboutCommon.render(content, config.app);
}
