import React from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {onThemeChange} from '../action/theme';
import {useDispatch} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../common/NavigationBar';

const THEME_COLOR = '#678';

export default function MyPage({navigation}) {
  const dispatch = useDispatch();
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
  const getLeftButton = callback => {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={() => callback && callback()}>
        <View style={{padding: 5, marginRight: 8}}>
          <Ionicons name={'ios-arrow-back'} size={26} style={{color: '#fff'}} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <NavigationBar
        title={'我的'}
        statusBar={{
          backgroundColor: THEME_COLOR,
          barStyle: 'light-content',
        }}
        rightButton={getRightButton()}
        leftButton={getLeftButton()}
        style={{
          backgroundColor: THEME_COLOR,
        }}
      />
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
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
