import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {onThemeChange} from '../action/theme';

export default function TrendingPage({navigation}) {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>TrendingPage</Text>
      <Button
        title="修改主题"
        onPress={() => {
          dispatch(onThemeChange('green'));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
