import React, {Fragment, useEffect, useState} from 'react';
import {Linking, View, Clipboard} from 'react-native';
import GlobalStyles from '../../res/GlobalStyles';
import AboutCommon from './AboutCommon';
import {FLAG_STORAGE} from '../../expand/dao/DataStore';
import configJson from '../../res/data/config.json';
import ViewUtil from '../../util/ViewUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from "react-native-root-toast";

const THEME_COLOR = '#007AFF';

export default function AboutMePage({navigation, route}) {
  const [config, setConfig] = useState(configJson);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showBlog, setShowBlog] = useState(false);
  const [showQQ, setShowQQ] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const aboutCommon = new AboutCommon(
    {
      ...route.params,
      navigation,
      flagAbout: FLAG_STORAGE.flag_about_me,
    },
    ({data}) => setConfig({...data}),
  );
  useEffect(() => {
    aboutCommon.componentDidMount();
    return () => aboutCommon.componentWillUnmount();
  }, []);
  const onClick = item => {
    if (item.url) {
      navigation.navigate('Webview', {
        ...item,
      });
    }
    if (item.account && item.account.indexOf('@') !== -1) {
      const url = `mailto://${item.account}`;
      Linking.canOpenURL(url)
        .then(support => {
          if (!support) {
            console.log(`Cant not handle url: ${url}`);
          } else {
            Linking.openURL(url);
          }
        })
        .catch(err => console.error(err));
    }
    if (item.account) {
      Clipboard.setString(item.account);
      Toast.show(`${item.title}:${item.account}已复制到剪贴板`, {
        position: Toast.positions.CENTER,
      });
    }
  };
  const getItem = (isShow, items, isShowAccount) => {
    if (!items) {
      return null;
    }
    if (isShow) {
      return Object.values(items).map(item => {
        const title = isShowAccount
          ? item.title + ':' + item.account
          : item.title;
        return (
          <Fragment key={title}>
            {ViewUtil.getSettingItem(() => onClick(item), title, THEME_COLOR)}
            <View style={GlobalStyles.line} />
          </Fragment>
        );
      });
    } else {
      return null;
    }
  };
  const _item = (data, isShow, callback) => {
    return ViewUtil.getSettingItem(
      () => callback && callback(!isShow),
      data.name,
      THEME_COLOR,
      Ionicons,
      data.icon,
      isShow ? 'ios-arrow-up' : 'ios-arrow-down',
    );
  };
  const content = (
    <View>
      {_item(config.aboutMe.Tutorial, showTutorial, val =>
        setShowTutorial(val),
      )}
      <View style={GlobalStyles.line} />
      {getItem(showTutorial, config.aboutMe.Tutorial.items)}
      {_item(config.aboutMe.Blog, showBlog, val => setShowBlog(val))}
      <View style={GlobalStyles.line} />
      {getItem(showBlog, config.aboutMe.Blog.items)}
      {_item(config.aboutMe.QQ, showQQ, val => setShowQQ(val))}
      <View style={GlobalStyles.line} />
      {getItem(showQQ, config.aboutMe.QQ.items, true)}
      {_item(config.aboutMe.Contact, showContact, val => setShowContact(val))}
      <View style={GlobalStyles.line} />
      {getItem(showContact, config.aboutMe.Contact.items, true)}
    </View>
  );
  return aboutCommon.render(content, config.author);
}
