import React from 'react';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import {View} from 'react-native';
import CustomTheme from './CustomTheme';

export default function HomePage() {
  return (
    <View style={{flex: 1}}>
      <DynamicTabNavigator />
      <CustomTheme />
    </View>
  );
}
