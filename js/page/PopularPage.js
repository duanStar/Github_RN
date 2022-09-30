import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {onLoadMorePopular, onRefreshPopularData} from '../action/popular';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-root-toast';
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from '../expand/dao/favoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import {onLoadLanguage} from '../action';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

const Tab = createMaterialTopTabNavigator();
const BASEURL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

function genTabs(keys = []) {
  const tabs = {};
  keys.forEach((item, index) => {
    if (item.checked) {
      tabs[`tab${index}`] = {
        name: item.name,
        children: props => <PopularTab {...props} tabLabel={item.name} />,
        options: {
          title: item.name,
          tabBarLabel: ({focused}) => {
            return (
              <Text style={{color: focused ? '#fff' : '#ccc'}}>
                {item.name}
              </Text>
            );
          },
        },
      };
    }
  });
  return tabs;
}

function TopTabNavigator() {
  const [tabs, setTabs] = useState(null);
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme.theme);
  useEffect(() => {
    language.keys.length > 0 && setTabs(genTabs(language.keys));
  }, [language.keys]);
  return language.keys.length > 0 && tabs ? (
    <Tab.Navigator
      screenOptions={{
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarScrollEnabled: true,
        tabBarStyle: {
          backgroundColor: theme.themeColor,
        },
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        lazy: true,
      }}>
      {Object.values(tabs).map((item, index) => (
        <Tab.Screen name={item.name} options={item.options} key={index}>
          {item.children}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  ) : null;
}

const genFetchUrl = key => {
  return BASEURL + key + QUERY_STR;
};

function PopularTab({tabLabel, navigation}) {
  const canLoad = useRef(false);
  const dataObject = useSelector(state => state.popular)[tabLabel];
  const theme = useSelector(state => state.theme.theme);
  const dispatch = useDispatch();
  const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
  useEffect(() => {
    const _unsubscribe = navigation.addListener('focus', () => {
      loadData(false);
    });
    return () => _unsubscribe();
  }, []);
  useEffect(() => {
    loadData(false);
  }, []);
  const loadData = loadMore => {
    const url = genFetchUrl(tabLabel);
    !loadMore
      ? dispatch(onRefreshPopularData(tabLabel, url, 10, favoriteDao))
      : dispatch(
          onLoadMorePopular(
            tabLabel,
            dataObject?.pageIndex || 1,
            10,
            dataObject?.items || [],
            favoriteDao,
            err => {
              Toast.show('没有更多了', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                animation: true,
                delay: 0,
              });
            },
          ),
        );
  };
  const renderItem = data => {
    const projectModel = data.item;
    return (
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
    );
  };
  const genFooter = () => {
    return dataObject?.hideMoreLoading ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={dataObject?.projectModes || []}
        renderItem={data => renderItem(data)}
        keyExtractor={item => `${item.item.id}`}
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
        ListFooterComponent={() => genFooter()}
        onEndReached={() => {
          setTimeout(() => {
            if (canLoad.current) {
              loadData(true);
              canLoad.current = false;
            }
          }, 100);
        }}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          canLoad.current = true;
        }}
      />
    </View>
  );
}

export default function PopularPage() {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.theme);
  useEffect(() => {
    dispatch(onLoadLanguage(FLAG_LANGUAGE.flag_key));
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <NavigationBar
          title={'最热'}
          statusBar={{
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
          }}
          style={{
            backgroundColor: theme.themeColor,
          }}
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
