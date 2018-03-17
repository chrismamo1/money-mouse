import Colors from '../constants/Colors';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';

export default class ReportsScreen extends React.Component {
  static navigationOptions = {
    title: 'Reports'
  };

  render() {
    return (
      <View style={styles.container} contentContainerStyle={[styles.contentContainer, styles.centered]}>
        <Text>Your reports will go here</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    alignItems: 'center'
  },
  contentContainer: {
    paddingTop: 30,
  },
  bigText: {
    fontSize: 20,
    fontWeight: "800"
  }
});
