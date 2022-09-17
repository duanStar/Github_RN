import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

export default function WelcomePage(props) {
  useEffect(() => {
    let timer = setTimeout(() => {
      NavigationUtil.resetToHomePage(props);
    }, 2000);
    return () => {
      timer && clearTimeout(timer);
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text>WelcomePage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
