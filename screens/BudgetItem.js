import Colors from '../constants/Colors';
import React from 'react';
import {
  Button,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as Model from '../lib/es6/mm/mm_model.js';

export default class BudgetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.state || {};
    this.state.category = props.category.name;
    this.parent = props.parent;
  }

  render() {
    return(
      <View style={[styles.horizontalContainer, {margin: 15, justifyContent: 'space-between'}]}>
        <View
          style={{
            margin: 15,
            marginLeft: 0,
            width: 15,
            height: 15,
            backgroundColor: Model.getCategoryColor(this.state.category)
          }} />
        <Text style={[styles.bigText, {flex: 1, marginTop: 8}]}>{this.state.category}</Text>
        <View style={{flex: 1}} />
        <TouchableOpacity
          onPress={
            () => {
              this.parent.props.navigation.navigate('CategoryAddScreen');
            }}>
          <Ionicons name="md-settings" size={32} color="green" />
        </TouchableOpacity>
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