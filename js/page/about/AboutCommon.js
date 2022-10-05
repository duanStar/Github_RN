import BackPressComponent from '../../common/BackPressComponent';
import NavigationUtil from '../../navigator/NavigationUtil';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../../res/GlobalStyles';
import {
  Image,
  Platform,
  View,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import ViewUtil from '../../util/ViewUtil';
import configJson from '../../res/data/config.json';
import Utils from '../../util/Utils';

const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = Platform.OS === 'ios' ? (20 + Utils.isIPhoneX() ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT =
  Platform.OS === 'ios'
    ? GlobalStyles.navBarHeightIOS + TOP
    : GlobalStyles.navBarHeightAndroid;

export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.updateState = updateState;
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
  }
  onBackPress() {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    this.updateState({
      data: configJson,
    });
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  getParallaxRenderConfig(params) {
    if (this.config) {
      return this.config;
    }
    this.config = {};
    const width = Dimensions.get('window').width;
    const avatar =
      typeof params.avatar === 'string' ? {uri: params.avatar} : params.avatar;
    this.config.renderBackground = () => (
      <View key={'background'}>
        <Image
          source={{
            uri: params.backgroundImg,
            width,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width,
            backgroundColor: 'rgba(0,0,0,.4)',
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
      </View>
    );
    this.config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image
          style={styles.avatar}
          source={{
            uri: avatar.uri,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
          }}
        />
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    );
    this.config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );
    this.config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack())}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>
    );
    return this.config;
  }
  render(contentView, params) {
    return (
      <ParallaxScrollView
        backgroundColor={this.props.theme.themeColor}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        {...this.getParallaxRenderConfig(params)}>
        {contentView}
      </ParallaxScrollView>
    );
  }
  onShare() {}
}
const styles = StyleSheet.create({
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
    alignItems: 'center',
  },
  fixedSection: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? TOP : 0,
    paddingRight: 8,
  },
});
