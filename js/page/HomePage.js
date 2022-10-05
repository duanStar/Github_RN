import React from 'react';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import CustomTheme from './CustomTheme';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {useSelector} from 'react-redux';

export default function HomePage() {
  const theme = useSelector(state => state.theme.theme);
  return (
    <SafeAreaViewPlus style={{flex: 1}} topColor={theme.themeColor}>
      <DynamicTabNavigator />
      <CustomTheme />
    </SafeAreaViewPlus>
  );
}
