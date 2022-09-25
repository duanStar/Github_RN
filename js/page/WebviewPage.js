import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import {WebView} from 'react-native-webview';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteDao from '../expand/dao/favoriteDao';

const THEME_COLOR = '#007AFF';

export default function WebviewPage({navigation, route}) {
  const [title, setTitle] = useState(route.params.title);
  const [url, setUrl] = useState(route.params.url);
  const urls = useRef([route.params.url]);
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
  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={title}
        leftButton={ViewUtil.getLeftBackButton(() => {
          onBack();
        })}
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
