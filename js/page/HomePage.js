import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PopularPage from './PopularPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import MyPage from './MyPage';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PopularPage"
        component={PopularPage}
        options={{
          tabBarLabel: '最热',
          tabBarIcon: ({color, focused}) => (
            <MaterialIcons name="whatshot" size={26} style={{color}} />
          ),
        }}
      />
      <Tab.Screen
        name="TrendingPage"
        component={TrendingPage}
        options={{
          tabBarLabel: '趋势',
          tabBarIcon: ({color, focused}) => (
            <Ionicons name={'trending-up'} size={26} style={{color}} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritePage"
        component={FavoritePage}
        options={{
          tabBarLabel: '收藏',
          tabBarIcon: ({color, focused}) => (
            <MaterialIcons name={'favorite'} size={26} style={{color}} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({color, focused}) => (
            <Entypo name={'user'} size={26} style={{color}} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function HomePage() {
  return <TabNavigator />;
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
