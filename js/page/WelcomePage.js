import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

export default function WelcomePage(props) {
  const {navigation} = props;
  useEffect(() => {
    NavigationUtil.navigation = navigation;
    let timer = setTimeout(() => {
      NavigationUtil.resetToHomePage({navigation});
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
