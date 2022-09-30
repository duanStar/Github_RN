import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {WebView} from 'react-native-webview';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteUtil from '../util/FavoriteUtil';
import FavoriteDao from '../expand/dao/favoriteDao';
import {useSelector} from 'react-redux';

const TRENDING_URL = 'https://github.com/';

export default function DetailPage({navigation, route}) {
  const theme = useSelector(state => state.theme.theme);
  const {projectModel, flag} = route.params;
  const {item} = projectModel;
  const favoriteDao = new FavoriteDao(flag);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isFavorite, setIsFavorite] = useState(projectModel.isFavorite);
  const urls = useRef([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const webviewRef = useRef();
  const onBack = () => {
    if (canGoBack && urls.current.length > 1) {
      urls.current.pop();
      webviewRef.current?.goBack();
    } else {
      navigation.goBack();
    }
  };
  const backPress = new BackPressComponent({
    backPress: () => {
      onBack();
      return true;
    },
  });
  useEffect(() => {
    backPress.componentDidMount();
    return () => {
      backPress.componentWillUnmount();
    };
  }, [canGoBack]);
  useEffect(() => {
    setUrl(item.html_url || item.repo_link || TRENDING_URL + item.fullName);
    urls.current.push(
      item.html_url || item.repo_link || TRENDING_URL + item.fullName,
    );
    setTitle(item.full_name || item.repo);
  }, [route.params]);
  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={title}
        titleLayoutStyle={{
          paddingRight: title.length > 20 ? 30 : 0,
        }}
        leftButton={ViewUtil.getLeftBackButton(() => {
          onBack();
        })}
        rightButton={
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                FavoriteUtil.onFavorite(favoriteDao, item, !isFavorite, flag);
                setIsFavorite(!isFavorite);
              }}>
              <FontAwesome
                name={isFavorite ? 'star' : 'star-o'}
                size={20}
                style={{color: '#fff', marginRight: 10}}
              />
            </TouchableOpacity>
            {ViewUtil.getShareButton(() => {})}
          </View>
        }
        statusBar={{
          backgroundColor: theme.themeColor,
          barStyle: 'light-content',
        }}
        style={{
          backgroundColor: theme.themeColor,
        }}
      />
      {url && (
        <WebView
          ref={webviewRef}
          startInLoadingState={true}
          onNavigationStateChange={e => {
            setCanGoBack(e.canGoBack);
            !urls.current.includes(e.url) && urls.current.push(e.url);
          }}
          source={{uri: url}}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
