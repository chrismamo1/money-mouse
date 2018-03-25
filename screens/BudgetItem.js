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
    this.state.category = props.category;
    this.parent = props.parent;
  }

  render() {
    let self = this;
    let spentSoFar =
      Model
        .getPaymentsForPeriod(new Date(), this.state.category.period)
        .reduce((acc, x) => { return acc + x.amount }, 0);
    console.log('Spent ', spentSoFar, ' so far');
    return(
      <View style={[styles.verticalContainer, {margin: 15, justifyContent: 'space-between'}]}>
        <View style={[styles.horizontalContainer, {justifyContent: 'space-between'}]}>
          <View
            style={{
              margin: 15,
              marginLeft: 0,
              width: 15,
              height: 15,
              backgroundColor: Model.getCategoryColor(this.state.category.name)
            }} />
          <Text style={[styles.bigText, {flex: 1, marginTop: 8}]}>{this.state.category.name}</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            onPress={
              (() => {
                self.parent.props.navigation.navigate('ModifyCategoryScreen', {category: this.state.category});
              }).bind(this)}>
            <Ionicons name="md-settings" size={32} color={Colors.tabIconDefault} />
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalContainer}>
          <View style={{height: 10, flex: 1}} />
        </View>
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