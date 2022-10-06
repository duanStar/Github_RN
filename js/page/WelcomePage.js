import React, {useEffect} from 'react';
import NavigationUtil from '../navigator/NavigationUtil';
import {useDispatch} from 'react-redux';
import {onThemeInit} from '../action';
import SplashScreen from 'react-native-splash-screen';

export default function WelcomePage(props) {
  const {navigation} = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onThemeInit());
  }, []);
  useEffect(() => {
    NavigationUtil.navigation = navigation;
    let timer = setTimeout(() => {
      SplashScreen.hide();
      NavigationUtil.resetToHomePage({navigation});
    }, 20);
    return () => {
      timer && clearTimeout(timer);
    };
  }, []);
  return null;
}
