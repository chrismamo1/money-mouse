import Colors from '../constants/Colors';
import React from 'react';
import {
  Button,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as Model from '../lib/js/mm/mm_model.js';

export default class BudgetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.state || {};
    this.state.category = props.category.name;
  }

  render() {
    return(
      <View style={[styles.horizontalContainer, {margin: 15, justifyContent: 'space-between'}]}>
        <Text style={[styles.bigText, {flex: 1}]}>{this.state.category}</Text>
        <View style={{flex: 1}} />
        <Button
          onPress={
            () => {
              Model.removeCategory(this.state.category);
              console.log('Removing category ' + this.state.category);
              this.props.mom.updateCategories()
            }}
          title="Remove"
          style={[styles.bigText, {flex: 1}]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  verticalContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  centered: {
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  bigText: {
    fontSize: 20,
    fontWeight: "800"
  }
});