import Colors from '../constants/Colors';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';

export default class CalendarScreen extends React.Component {
  static navigationOptions = {
    title: 'Calendar',
    header: <Text>MoneyMouse</Text>
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer,styles.centered]}>
          <View>
            <Text style={styles.bigText}>MoneyMouse</Text>
          </View>
        </ScrollView>
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