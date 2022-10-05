import {Component} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import Utils from "../util/Utils";

export default class SafeAreaViewPlus extends Component {
  static propTypes = {
    topColor: PropTypes.string,
    bottomColor: PropTypes.string,
    enablePlus: PropTypes.bool,
    topInset: PropTypes.bool,
    bottomInset: PropTypes.bool,
  };
  static defaultProps = {
    topColor: 'transparent',
    bottomColor: '#f8f8f8',
    enablePlus: true,
    topInset: true,
    bottomInset: false,
  };
  genSafeAreaViewPlus() {
    const {children, topColor, topInset, bottomColor, bottomInset} = this.props;
    return (
      <View style={styles.container}>
        {this.genTopArea(topColor, topInset)}
        {children}
        {this.genBottomArea(bottomColor, bottomInset)}
      </View>
    );
  }
  genSafeAreaView() {
    const {children} = this.props;
    return (
      <SafeAreaView
        style={[styles.container, this.props.style]}
        {...this.props}>
        {children}
      </SafeAreaView>
    );
  }
  genTopArea(topColor, topInset) {
    return !Utils.isIPhoneX() || !topInset ? null : (
      <View style={[styles.topArea, {backgroundColor: topColor}]} />
    );
  }
  genBottomArea(bottomColor, bottomInset) {
    return !Utils.isIPhoneX() || !bottomInset ? null : (
      <View style={[styles.bottomArea, {backgroundColor: bottomColor}]} />
    );
  }
  render() {
    const {enablePlus} = this.props;
    return enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topArea: {
    height: 44,
  },
  bottomArea: {
    height: 34,
  },
});
