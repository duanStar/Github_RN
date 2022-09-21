import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {WebView} from 'react-native-webview';
import BackPressComponent from '../common/BackPressComponent';

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#007AFF';

export default function DetailPage({navigation, route}) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
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
    const {projectModel} = route.params;
    setUrl(
      projectModel.html_url ||
        projectModel.repo_link ||
        TRENDING_URL + projectModel.fullName,
    );
    urls.current.push(
      projectModel.html_url ||
        projectModel.repo_link ||
        TRENDING_URL + projectModel.fullName,
    );
    setTitle(projectModel.full_name || projectModel.repo);
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
            <TouchableOpacity onPress={() => {}}>
              <FontAwesome
                name={'star-o'}
                size={20}
                style={{color: '#fff', marginRight: 10}}
              />
            </TouchableOpacity>
            {ViewUtil.getShareButton(() => {})}
          </View>
        }
        statusBar={{
          backgroundColor: THEME_COLOR,
          barStyle: 'light-content',
        }}
        style={{
          backgroundColor: THEME_COLOR,
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
