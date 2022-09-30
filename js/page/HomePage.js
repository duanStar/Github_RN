import React, {useEffect} from 'react';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import {View} from 'react-native';
import CustomTheme from './CustomTheme';
import {useDispatch} from 'react-redux';
import {onThemeInit} from '../action';

export default function HomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onThemeInit());
  }, []);
  return (
    <View style={{flex: 1}}>
      <DynamicTabNavigator />
      <CustomTheme />
    </View>
  );
}
