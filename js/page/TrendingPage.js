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
import {onLoadMoreTrending, onRefreshTrending} from '../action';
import Toast from 'react-native-root-toast';
import NavigationBar from '../common/NavigationBar';
import TrendingItem from '../common/TrendingItem';
import TrendingDialog from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createMaterialTopTabNavigator();
const TAB_NAMES = ['All', 'Java', 'C', 'C++', 'JavaScript', 'Python'];
const TRENDING_URL = 'https://trendings.herokuapp.com/repo';

function genTabs() {
  const tabs = {};
  TAB_NAMES.forEach((item, index) => {
    tabs[`tab${index}`] = {
      name: item,
      children: since => props =>
        <TrendingTab {...props} tabLabel={item} since={since} />,
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

function TopTabNavigator({since}) {
  const tabs = genTabs();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarScrollEnabled: true,
        tabBarStyle: {
          backgroundColor: '#007AFF',
        },
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
      }}>
      {Object.values(tabs).map((item, index) => (
        <Tab.Screen name={item.name} options={item.options} key={index}>
          {item.children(since)}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

function TrendingTab({tabLabel, since}) {
  const canLoad = useRef(false);
  const dataObject = useSelector(state => state.trending)[tabLabel];
  const dispatch = useDispatch();
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
      ? dispatch(onRefreshTrending(tabLabel, TRENDING_URL, 10, params))
      : dispatch(
          onLoadMoreTrending(
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
    return <TrendingItem item={item} onSelect={() => {}} />;
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
        keyExtractor={item => `${item.repo}`}
        refreshControl={
          <RefreshControl
            title={'loading'}
            titleColor={'#007AFF'}
            colors={['#007AFF']}
            refreshing={dataObject?.isLoading || false}
            onRefresh={() => loadData()}
            tintColor={'#007AFF'}
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
            backgroundColor: '#007AFF',
            barStyle: 'light-content',
          }}
          style={{
            backgroundColor: '#007AFF',
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
