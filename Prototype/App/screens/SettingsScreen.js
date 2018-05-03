import Colors from '../constants/Colors';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
 } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={styles.container} contentContainerStyle={[styles.contentContainer, styles.centered]}>
        <Text>You will be able to add categories here.</Text>
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
