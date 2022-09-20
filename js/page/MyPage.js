import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {onThemeChange} from '../action/theme';
import {useDispatch} from 'react-redux';

export default function MyPage({navigation}) {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>MyPage</Text>
      <Button
        title="修改主题"
        onPress={() => {
          dispatch(onThemeChange('red'));
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
