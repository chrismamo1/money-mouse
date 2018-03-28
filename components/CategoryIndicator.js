import Colors from '../constants/Colors';
import styles from '../constants/Styles';
import React from 'react';
import {
  Text,
  View
} from 'react-native';

import * as Model from '../lib/es6/mm/mm_model.js';

export default class CategoryIndicator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={[styles.centered, {width: 40, margin: 5}]}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: Model.getCategoryColor(this.props.categoryName)
          }} />
        <Text numberOfLines={1} style={[styles.smallText, styles.secondaryText]}>
          {this.props.categoryName}
        </Text>
      </View>);
  }
}