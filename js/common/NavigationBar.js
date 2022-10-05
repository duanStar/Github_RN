import PropTypes from 'prop-types';
import {StatusBar, Text, View, StyleSheet, Platform} from 'react-native';
import Utils from '../util/Utils';

const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = Utils.isIPhoneX() ? 0 : 20;

function NavigationBar(props) {
  const {barStyle = 'light-content', hidden = false} = props.statusBar;
  const getButtonElement = button => {
    return <View style={styles.navBarButton}>{button ? button : null}</View>;
  };
  const statusBar = !hidden ? (
    <View style={styles.statusBar}>
      <StatusBar {...props.statusBar} barStyle={barStyle} />
    </View>
  ) : null;
  const titleView = props.titleView ? (
    props.titleView
  ) : (
    <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>
      {props.title}
    </Text>
  );
  const content = props.hide ? null : (
    <View style={styles.navBar}>
      {getButtonElement(props.leftButton)}
      <View style={[styles.navBarTitleContainer, props.titleLayoutStyle]}>
        {titleView}
      </View>
      {getButtonElement(props.rightButton)}
    </View>
  );
  return (
    <View style={[styles.container, props.style]}>
      {statusBar}
      {content}
    </View>
  );
}

NavigationBar.propTypes = {
  title: PropTypes.string,
  titleView: PropTypes.element,
  hide: PropTypes.bool,
  statusBar: PropTypes.shape(StatusBarShape),
  rightButton: PropTypes.element,
  leftButton: PropTypes.element,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196f3',
  },
  navBarButton: {
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  navBarTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
});

export default NavigationBar;
