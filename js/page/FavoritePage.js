import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from '../expand/dao/favoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import {onLoadFavoriteData} from '../action';
import TrendingItem from '../common/TrendingItem';
import ViewUtil from "../util/ViewUtil";

const Tab = createMaterialTopTabNavigator();
const TAB_NAMES = [
  ['最热', FLAG_STORAGE.flag_popular],
  ['趋势', FLAG_STORAGE.flag_trending],
];

function genTabs() {
  const tabs = {};
  TAB_NAMES.forEach((item, index) => {
    tabs[`tab${index}`] = {
      name: item[1],
      children: props => (
        <FavoriteTab {...props} tabLabel={item[0]} flag={item[1]} />
      ),
      options: {
        title: item[0],
        tabBarLabel: ({focused}) => {
          return (
            <Text style={{color: focused ? '#fff' : '#ccc'}}>{item[0]}</Text>
          );
        },
      },
    };
  });
  return tabs;
}

function TopTabNavigator() {
  const theme = useSelector(state => state.theme.theme);
  const tabs = genTabs();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: false,
        tabBarStyle: {
          backgroundColor: theme.themeColor,
        },
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
      }}>
      {Object.values(tabs).map((item, index) => (
        <Tab.Screen name={item.name} options={item.options} key={index}>
          {item.children}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

function FavoriteTab({navigation, flag}) {
  const dataObject = useSelector(state => state.favorite)[flag];
  const theme = useSelector(state => state.theme.theme);
  const dispatch = useDispatch();
  const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
  useEffect(() => {
    const _unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return () => _unsubscribe();
  }, []);
  const loadData = isShowLoading => {
    dispatch(onLoadFavoriteData(flag, isShowLoading));
  };
  const renderItem = data => {
    const projectModel = data.item;
    return flag === FLAG_STORAGE.flag_popular ? (
      <PopularItem
        projectModel={projectModel}
        onSelect={() => {
          navigation.navigate('Detail', {
            projectModel: projectModel,
            flag: FLAG_STORAGE.flag_popular,
          });
        }}
        onFavorite={(item, isFavorite) => {
          projectModel.isFavorite = isFavorite;
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          );
        }}
      />
    ) : (
      <TrendingItem
        projectModel={projectModel}
        onSelect={() => {
          navigation.navigate('Detail', {
            projectModel: projectModel,
            flag: FLAG_STORAGE.flag_trending,
          });
        }}
        onFavorite={(item, isFavorite) => {
          projectModel.isFavorite = isFavorite;
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_trending,
          );
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dataObject?.projectModes || []}
        renderItem={data => renderItem(data)}
        keyExtractor={item =>
          `${
            flag === FLAG_STORAGE.flag_popular ? item.item.id : item.item.repo
          }`
        }
        refreshControl={
          <RefreshControl
            title={'loading'}
            titleColor={theme.themeColor}
            colors={[theme.themeColor]}
            refreshing={dataObject?.isLoading || false}
            onRefresh={() => loadData()}
            tintColor={theme.themeColor}
          />
        }
      />
    </View>
  );
}

export default function FavoritePage({navigation}) {
  const theme = useSelector(state => state.theme.theme);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <NavigationBar
          title={'收藏'}
          statusBar={{
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
          }}
          style={{
            backgroundColor: theme.themeColor,
          }}
          rightButton={ViewUtil.getSearchButton(() => {
            navigation.navigate('Search');
          })}
        />
        <TopTabNavigator />
      </View>
    </SafeAreaView>
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
  tabBarItemStyle: {
    // minWidth: 50,
  },
  tabBarIndicatorStyle: {
    height: 2,
    backgroundColor: '#fff',
  },
  tabBarLabelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: '#fff',
    margin: 10,
  },
});
