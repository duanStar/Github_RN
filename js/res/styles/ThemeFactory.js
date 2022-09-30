import {StyleSheet} from 'react-native';

export const ThemeFlags = {
  Default: '#2196F3',
  Red: '#F44336',
  Purple: '#9c27B0',
  Pink: '#E91E63',
  DeepPurple: '#673ab7',
  Indigo: '#3f51b5',
  Blue: '#2196f3',
  LightBlue: '#03a9f4',
  Cyan: '#00bcd4',
  Teal: '#009688',
  Green: '#4caf50',
  LightGreen: '#8bc34a',
  Lime: '#CDDC39',
  Yellow: '#FFEB3B',
  Amber: '#FFC107',
  Orange: '#FF9800',
  DeepOrange: '#FF5722',
  Brown: '#795548',
  Grey: '#9E9E9E',
  BlueGrey: '#607D8B',
  Black: '#000',
};

export default class ThemeFactory {
  static createTheme(themeFlag) {
    return {
      themeColor: themeFlag,
      styles: StyleSheet.create({
        selectedTitleStyle: {
          color: themeFlag,
        },
        tabBarSelectedIcon: {
          tintColor: themeFlag,
        },
        navBar: {
          backgroundColor: themeFlag,
        },
      }),
    };
  }
}
