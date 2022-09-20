import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {onLoadMorePopular, onRefreshPopularData} from '../action/popular';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-root-toast';

const Tab = createMaterialTopTabNavigator();
const TAB_NAMES = [
  'Java',
  'C',
  'C++',
  'IOS',
  'Android',
  'JavaScript',
  'React',
  'Vue',
];
const BASEURL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

function genTabs() {
  const tabs = {};
  TAB_NAMES.forEach((item, index) => {
    tabs[`tab${index}`] = {
      name: item,
      children: props => <PopularTab {...props} tabLabel={item} />,
      options: {
        title: item,
        tabBarLabel: ({focused}) => {
          return <Text style={{color: focused ? '#fff' : '#ccc'}}>{item}</Text>;
        },
      },
    };
  });
  return tabs;
}

function TopTabNavigator() {
  const tabs = genTabs();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarScrollEnabled: true,
        tabBarStyle: {
          backgroundColor: '#a67',
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

const genFetchUrl = key => {
  return BASEURL + key + QUERY_STR;
};

function PopularTab({tabLabel, navigation}) {
  const canLoad = useRef(false);
  const dataObject = useSelector(state => state.popular)[tabLabel];
  const dispatch = useDispatch();
  useEffect(() => {
    loadData(false);
  }, []);
  const loadData = loadMore => {
    const url = genFetchUrl(tabLabel);
    !loadMore
      ? dispatch(onRefreshPopularData(tabLabel, url, 10))
      : dispatch(
          onLoadMorePopular(
            tabLabel,
            dataObject?.pageIndex || 1,
            10,
            dataObject?.items || [],
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
    const item = data.item;
    return <PopularItem item={item} onSelect={() => {}} />;
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
        keyExtractor={item => `${item.id}`}
        refreshControl={
          <RefreshControl
            title={'loading'}
            titleColor={'red'}
            colors={['red']}
            refreshing={dataObject?.isLoading || false}
            onRefresh={() => loadData()}
            tintColor={'red'}
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
  return (
    <View style={styles.container}>
      <TopTabNavigator />
    </View>
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
    minWidth: 50,
  },
  tabBarIndicatorStyle: {
    height: 2,
    backgroundColor: '#fff',
  },
  tabBarLabelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
