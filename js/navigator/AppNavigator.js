import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebviewPage from '../page/WebviewPage';
import AboutPage from '../page/about/AboutPage';
import AboutMePage from '../page/about/AboutMePage';
import CustomKeyPage from '../page/CustomKeyPage';
import SortKeyPage from '../page/SortKeyPage';
import SearchPage from '../page/SearchPage';
import CodePushPage from "../page/CodePushPage";

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
        <Stack.Screen
          name="AboutMe"
          component={AboutMePage}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="CustomKey"
          component={CustomKeyPage}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="SortKey"
          component={SortKeyPage}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchPage}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="CodePush"
          component={CodePushPage}
          options={{
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
