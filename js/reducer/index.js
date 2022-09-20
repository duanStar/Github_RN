import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular';

const index = combineReducers({
  theme,
  popular,
});

export default index;
