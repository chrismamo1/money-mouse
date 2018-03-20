import Colors from '../constants/Colors';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class BudgetItem {
  constructor(props) {
    super(props);
    this.state = this.state || {};
    this.state.category = props.catName;
  }

  render() {
    return(
      <View style={styles.verticalContainer}>
        <Text style={styles.bigText}>{this.props.catName}</Text>
        <View style={styles.horizontalContainer}>
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