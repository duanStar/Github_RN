import {Dimensions} from 'react-native';

export const BACKGROUND_COLOR = '#f3f3f4';
const {width, height} = Dimensions.get('window');
export default {
  line: {
    height: 0.5,
    opacity: 0.5,
    backgroundColor: 'darkgray',
  },
  rootContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  backgroundColor: BACKGROUND_COLOR,
  navBarHeightIOS: 44,
  navBarHeightAndroid: 50,
  windowHeight: height,
  windowWidth: width,
};
