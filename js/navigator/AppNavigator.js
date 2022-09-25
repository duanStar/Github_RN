import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebviewPage from '../page/WebviewPage';
import AboutPage from '../page/about/AboutPage';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Init"
          component={WelcomePage}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Main"
          component={HomePage}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailPage}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Webview"
          component={WebviewPage}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="About"
          component={AboutPage}
          options={{
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
