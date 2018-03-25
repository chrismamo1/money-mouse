import BillAddScreen from './BillAddScreen.js';
import BillList from './BillList.js';

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

import { Agenda, Calendar, CalendarList } from 'react-native-calendars';
import { StackNavigator } from 'react-navigation';

import { TextInputMask } from 'react-native-masked-text';

import * as Model from '../lib/es6/mm/mm_model.js';

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
    let bills =
      Model
        .getBillsForMonth(2018, new Date().getMonth())
        .map((x) => {
          let rv = {};
          let date = x.date;
          let month = date.getMonth() + 1;
          if (month.toString().length < 2) {
            month = '0' + month;
          }
          let day = date.getDate();
          if (day.toString().length < 2) {
            day = '0' + day;
          }
          let s = date.getFullYear() + '-' + month + '-' + day;
          rv['date'] = s;
          rv['color'] = Model.getCategoryColor(x.category);
          rv['key'] = x.id;
          return rv;
        })
        .reduce((acc, x) => {
          if (!(acc[x.date])) {
            acc[x.date] = {
              dots: [{key: x.key, color: x.color, selectedDotColor: x.color}],
              marked: true
            };
          } else {
            let dots = acc[x.date].dots;
            acc[x.date] = {
              dots: [{key: x.key, color: x.color}, ...dots],
              marked: true
            };
          }
          return acc;
        },
        {});
    let marks = bills;
    this.setState({marks});
  }

  componentWillMount() {
    console.log('Main calendar screen will mount');
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
    console.log('Marks: ', marks);
    let calendarStyle = {
      width: '100%'
    };
      //<Calendar style={calendarStyle} markedDates={marks} onDayPress={_handleDayPress} />;
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let bills = <BillList year={year} month={month} />;
    let calendar = (
      <Calendar
        markedDates={marks}
        onDayPress={
          (day) => {
            console.log('this.state: ', this.state);
            _handleDayPress(day)
          }}
        markingType={'multi-dot'} />);
    console.log('calendar state: ', calendar.props);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer]}>
          {calendar}
          {bills}
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