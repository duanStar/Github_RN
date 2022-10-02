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
  TextInput,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-root-toast';
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from '../expand/dao/favoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import {
  onSearch,
  onSearchMore,
  onSearchCancel,
  onLoadLanguage,
} from '../action';
import BackPressComponent from '../common/BackPressComponent';
import GlobalStyles from '../res/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import Utils from '../util/Utils';

export default function SearchPage({navigation}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.theme);
  const canLoad = useRef(false);
  const searchToken = useRef();
  const inputRef = useRef();
  const dataObject = useSelector(state => state.search);
  const popularKeys = useSelector(state => state.language).keys;
  const [inputKey, setInputKey] = useState('');
  const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
  const languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
  const backPress = new BackPressComponent({
    backPress: onBack,
  });
  useEffect(() => {
    const _unsubscribe = navigation.addListener('focus', () => {
      inputRef.current?._internalFiberInstanceHandleDEV?.memoizedProps?.text &&
        loadData(false);
    });
    return () => _unsubscribe();
  }, []);
  useEffect(() => {
    backPress.componentDidMount();
    return () => backPress.componentWillUnmount();
  }, []);
  const loadData = loadMore => {
    !loadMore
      ? dispatch(
          onSearch(
            inputKey ||
              inputRef.current?._internalFiberInstanceHandleDEV?.memoizedProps
                ?.text,
            10,
            (searchToken.current = +new Date()),
            favoriteDao,
            popularKeys,
            err => {
              Toast.show(err, {
                position: Toast.positions.CENTER,
              });
            },
          ),
        )
      : dispatch(
          onSearchMore(
            dataObject?.pageIndex,
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
    return dataObject?.hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  };
  const onBack = () => {
    dispatch(onSearchCancel(searchToken.current));
    navigation.goBack();
    return true;
  };
  const saveKey = () => {
    if (Utils.checkKeyIsExists(inputKey, popularKeys)) {
      Toast.show(`${inputKey}已存在`, {
        position: Toast.positions.CENTER,
      });
    } else {
      const keys = [
        ...popularKeys,
        {path: inputKey, name: inputKey, checked: true},
      ];
      languageDao.save(keys);
      Toast.show(`${inputKey} 保存成功`, {
        position: Toast.positions.CENTER,
      });
      dispatch(onLoadLanguage(FLAG_LANGUAGE.flag_key));
    }
  };
  const onRightButtonClick = () => {
    if (dataObject?.showText === '搜索') {
      loadData(false);
    } else {
      dispatch(onSearchCancel(searchToken.current));
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <NavigationBar
          statusBar={{
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
          }}
          style={{
            backgroundColor: theme.themeColor,
          }}
          leftButton={ViewUtil.getLeftBackButton(() => onBack())}
          rightButton={
            <TouchableOpacity
              onPress={() => {
                inputRef.current?.blur();
                onRightButtonClick();
              }}>
              <View style={{marginRight: 10}}>
                <Text style={styles.title}>{dataObject?.showText}</Text>
              </View>
            </TouchableOpacity>
          }
          titleView={
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                value={inputKey}
                autoFocus={true}
                ref={inputRef}
                placeholder={'请输入'}
                style={styles.textInput}
                onChangeText={text => setInputKey(text?.trim())}
              />
            </View>
          }
        />
        {!dataObject.isLoading ? (
          <View style={{flex: 1}}>
            <FlatList
              style={{
                marginBottom: dataObject?.showBottomButton ? 50 : 0,
              }}
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
        ) : (
          <ActivityIndicator
            style={styles.center}
            size={'large'}
            animating={dataObject?.isLoading}
          />
        )}
        {dataObject?.showBottomButton ? (
          <TouchableOpacity
            style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
            onPress={() => {
              saveKey();
            }}>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.title}>朕收下了</Text>
            </View>
          </TouchableOpacity>
        ) : null}
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
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    right: 10,
    top: GlobalStyles.windowHeight - 70,
    borderRadius: 3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: Platform.OS === 'ios' ? 26 : 36,
    borderWidth: Platform.OS === 'ios' ? 1 : 2,
    borderColor: '#fff',
    alignSelf: 'center',
    paddingBottom: 8,
    paddingLeft: 10,
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 3,
    opacity: 0.7,
    color: '#fff',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
});
