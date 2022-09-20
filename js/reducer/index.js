import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';

const index = combineReducers({
  theme,
  popular,
  trending,
});

export default index;
