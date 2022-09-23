import {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    };
  }
  static getDerivedStateFromProps(nextProps) {
    return {
      isFavorite: nextProps.projectModel.isFavorite,
    };
  }
  setFavoriteState(isFavorite) {
    this.setState({
      isFavorite,
    });
  }
  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
  }
  _favoriteIcon() {
    return (
      <TouchableOpacity onPress={() => this.onPressFavorite()}>
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          style={{color: '#678'}}
          size={26}
        />
      </TouchableOpacity>
    );
  }
}
