import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {onLoadLanguage, onLoadMoreTrending, onRefreshTrending} from '../action';
import Toast from 'react-native-root-toast';
import NavigationBar from '../common/NavigationBar';
import TrendingItem from '../common/TrendingItem';
import TrendingDialog from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FavoriteDao from '../expand/dao/favoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

const Tab = createMaterialTopTabNavigator();
const TRENDING_URL = 'https://trendings.herokuapp.com/repo';

function genTabs(languages) {
  const tabs = {};
  languages.forEach((item, index) => {
    if (item.checked) {
      tabs[`tab${index}`] = {
        name: item.name,
        children: since => props =>
          (
            <TrendingTab
              {...props}
              tabLabel={item.name === 'All Language' ? 'All' : item.path}
              since={since}
            />
          ),
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

function TopTabNavigator({since}) {
  const [tabs, setTabs] = useState(null);
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme.theme);
  useEffect(() => {
    language.languages.length > 0 && setTabs(genTabs(language.languages));
  }, [language.languages]);
  return language.languages.length > 0 && tabs ? (
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
          {item.children(since)}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  ) : null;
}

function TrendingTab({tabLabel, since, navigation}) {
  const canLoad = useRef(false);
  const dataObject = useSelector(state => state.trending)[tabLabel];
  const theme = useSelector(state => state.theme.theme);
  const dispatch = useDispatch();
  const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
  useEffect(() => {
    const _unsubscribe = navigation.addListener('focus', () => {
      loadData(false);
    });
    return () => _unsubscribe();
  }, []);
  useEffect(() => {
    loadData(false);
  }, [since]);
  const loadData = loadMore => {
    const params =
      tabLabel === 'All'
        ? {
            since: since || 'daily',
          }
        : {
            since: since || 'daily',
            lang: tabLabel,
          };
    !loadMore
      ? dispatch(
          onRefreshTrending(tabLabel, TRENDING_URL, 10, params, favoriteDao),
        )
      : dispatch(
          onLoadMoreTrending(
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
        keyExtractor={item => `${item.item.repo}`}
        refreshControl={
          <RefreshControl
            title={'loading'}
            titleColor={theme.themeColor}
            colors={[theme.themeColor]}
            refreshing={dataObject?.isLoading || false}
            onRefresh={() => loadData(false)}
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

export default function TrendingPage({navigation}) {
  const [text, setText] = useState('今 天');
  const [since, setSince] = useState('daily');
  const dialogRef = useRef(null);
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.theme);
  useEffect(() => {
    dispatch(onLoadLanguage(FLAG_LANGUAGE.flag_language));
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <NavigationBar
          titleView={
            <TouchableOpacity onPress={() => dialogRef.current?.show()}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#fff',
                    fontWeight: '400',
                  }}>
                  趋势 {text}
                </Text>
                <MaterialIcons
                  name={'arrow-drop-down'}
                  size={22}
                  style={{color: '#fff'}}
                />
              </View>
            </TouchableOpacity>
          }
          statusBar={{
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
          }}
          style={{
            backgroundColor: theme.themeColor,
          }}
        />
        <TopTabNavigator since={since} />
        <TrendingDialog
          ref={dialogRef}
          onSelect={time => {
            setText(time.showText);
            setSince(time.searchText);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
