import Colors from '../constants/Colors';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
 } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';

export default class BudgetScreen extends React.Component {
  static navigationOptions = {
    title: 'Budget'
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={styles.container} contentContainerStyle={[styles.contentContainer, styles.centered]}>
        <Text>Your budget will go here</Text>
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