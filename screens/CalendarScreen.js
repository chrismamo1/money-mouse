import BillAddScreen from './BillAddScreen.js';

import Colors from '../constants/Colors';
import React from 'react';
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';

import { Calendar, CalendarList } from 'react-native-calendars';
import { StackNavigator } from 'react-navigation';

import { TextInputMask } from 'react-native-masked-text';

import * as Model from '../lib/js/mm/mm_model.js';

class MainCalendarScreen extends React.Component {
  static navigationOptions = {
    title: 'Calendar',
  };

  constructor(props) {
    console.log("Testing in constructor before super");
    super(props);
    console.log("Testing in constructor");
    this.state = {};
    this.updateMarks = this.updateMarks.bind(this);
  }

  updateMarks() {
    console.log('About to get dates');
    let dates = Model.getBillsForMonth(2018, new Date().getMonth());
    console.log('Dates: ', dates);
    let marks = {};
    for (let i in dates) {
      console.log('i: ', i);
      let date = dates[i];
      let s = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      marks[s] = { marked: true, dotColor: 'red' };
    }
    this.setState({marks});
  }

  componentWillMount() {
    this.updateMarks();
    this.forceUpdate();
  }

  render() {
    let _handleDayPress = (day) => {
      let asDate = new Date(day.year, day.month - 1, day.day);
      console.log(asDate.toDateString());
      this.props.navigation.navigate('BillAddScreen', {activeBillDate: asDate});
    };
    const marks = this.state.marks;
    let calendar =
      (marks)
        ? <Calendar markedDates={marks} onDayPress={_handleDayPress} />
        : <Calendar onDayPress={_handleDayPress} />;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer,styles.centered]}>
          {calendar}
        </ScrollView>
      </View>
    );
  }
}

let CalendarScreen = StackNavigator(
  {
    MainCalendarScreen: {
      screen: MainCalendarScreen,
    },
    BillAddScreen: {
      screen: BillAddScreen
    }
  }
);

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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