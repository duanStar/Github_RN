import PopularPage from '../page/PopularPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, {useRef} from 'react';
import TrendingPage from '../page/TrendingPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { useSelector } from "react-redux";

const TABS = {
  PopularPage: {
    name: 'PopularPage',
    component: PopularPage,
    options: {
      tabBarLabel: '最热',
      tabBarIcon: ({color, focused}) => (
        <MaterialIcons name="whatshot" size={26} style={{color}} />
      ),
    },
  },
  TrendingPage: {
    name: 'TrendingPage',
    component: TrendingPage,
    options: {
      tabBarLabel: '趋势',
      tabBarIcon: ({color, focused}) => (
        <Ionicons name="trending-up" size={26} style={{color}} />
      ),
    },
  },
  FavoritePage: {
    name: 'FavoritePage',
    component: FavoritePage,
    options: {
      tabBarLabel: '收藏',
      tabBarIcon: ({color, focused}) => (
        <MaterialIcons name="favorite" size={26} style={{color}} />
      ),
    },
  },
  MyPage: {
    name: 'MyPage',
    component: MyPage,
    options: {
      tabBarLabel: '我的',
      tabBarIcon: ({color, focused}) => (
        <Entypo name="user" size={26} style={{color}} />
      ),
    },
  },
};

const Tab = createBottomTabNavigator();

function TabNavigator(props) {
  const theme = useSelector(state => state.theme.theme);
  const {PopularPage, MyPage, FavoritePage, TrendingPage} = TABS;
  const tabs = [PopularPage, TrendingPage, FavoritePage, MyPage];
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => null,
        tabBarActiveTintColor: theme,
      }}>
      {tabs.map((tab, index) => (
        <Tab.Screen
          key={index}
          name={tab.name}
          component={tab.component}
          options={tab.options}
        />
      ))}
    </Tab.Navigator>
  );
}

function TabBarComponent(props) {
  const themes = useRef({
    color: '#007AFF',
    updateTime: new Date().getTime(),
  });
  const {state, descriptors} = props;
  const {routes, index} = state;
  if (routes[index].params) {
    const {theme} = routes[index].params;
    if (theme && theme.updateTime > themes.current.updateTime) {
      themes.current = {
        ...theme,
      };
    }
  }
  for (let key in descriptors) {
    descriptors[key].options.tabBarActiveTintColor = themes.current.color;
  }
  return <BottomTabBar {...props} />;
}

export default function DynamicTabNavigator() {
  return <TabNavigator />;
}
