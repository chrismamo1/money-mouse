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

import * as Date from '../lib/js/mm/date.js';
import * as Mm_model from '../lib/js/mm/mm_model.js';
import * as Bill from '../lib/js/mm/bill.js';

let Model = Mm_model;

function getNumbers(upTo) {
  let numbers = [];
  for (let i = 1; i <= upTo; i++) {
    numbers.push(i);
  }
  return numbers;
};

function getNItems(upTo) {
  let items = getNumbers(upTo).map((x, i) => <Picker.Item label={x.toString()} value={x} key={i} />);
  return items;
}

export default class BillAddScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Bill'
  };

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    console.log('Reconstructing view.');
    this.state = {
      scheduleType: 'Monthly',
      scheduleValue: this.params.activeBillDate.getDate()
    };
  }

  onChangeAmount(amt) {
    let x = parseFloat(amt.replace('$', '').replace(',', ''));
    this.setState({billAmount: x, amountText: amt})
  }

  onChangeScheduleType(x, _) {
    let newState = {scheduleType: x};
    switch (x) {
    case 'Monthly':
      newState.scheduleValue = this.params.activeBillDate.getDate();
      break;
    case 'Weekly':
      newState.scheduleValue = this.params.activeBillDate.getDay();
      break;
    case 'Fixed':
      newState.scheduleValue = 30;
      break;
    }
    this.setState(newState);
    console.log(this.state);
  }

  submit() {
    let sched;
    switch (this.state.scheduleType) {
    case 'Fixed':
      sched = Bill.fixed(this.state.scheduleValue);
      break;
    case 'Weekly':
      sched = Bill.weekly(this.state.scheduleValueWeekday);
      break;
    case 'Monthly':
      sched = Bill.monthlyInterval(this.state.scheduleValue);
      break;
    };
    Model.addBill(this.state.valueCompany, sched, this.state.billAmount, this.params.activeBillDate);
    this.props.navigation.navigate('MainCalendarScreen');
  }

  render() {
    const params = this.params;
    let labeledFormStyle = {
      flexDirection: 'row'
    };
    let schedulerView, numbers;
    let iStyle = {
      flex: 1,
      marginTop: 10,
      marginLeft: 20,
      fontSize: 20
    };
    switch (this.state.scheduleType) {
    case 'Monthly':
      numbers = getNItems(31);
      schedulerView = (
        <View style={[styles.container, {flexDirection: 'row', marginLeft: 20}]}>
          <Text style={iStyle}>On day</Text>
          <Picker
            style={{flex: 1, width: 50}}
            selectedValue={this.state.scheduleValue}
            onValueChange={(
              (x, _) => {
                console.log(x);
                this.setState({scheduleValue: x})
              }
            ).bind(this)}>
            {numbers}
          </Picker>
          <Text style={iStyle}>of every month</Text>
        </View>);
      break;
    case 'Weekly':
      let weekDay = this.params.activeBillDate.getDay();
      let nth = this.params.activeBillDate.getDate() / 7;
      let sWeekDay = Date.dayToString(weekDay);
      let allDays =
        getNumbers(7)
          .map((_, i) => Date.dayToString(i))
          .map((x, i) => <Picker.Item label={x} value={i} key={i} />);
      schedulerView = (
        <View style={[styles.container, {flexDirection: 'row'}]}>
          <Text style={iStyle}>Every</Text>
          <Picker
            style={{flex: 1, width: 50}}
            selectedValue={this.state.scheduleValue}
            onValueChange={((x, _) => {this.setState({scheduleValueWeekday: x})}).bind(this)}>
            {allDays}
          </Picker>
        </View>);
      break;
    case 'Fixed':
      numbers = getNItems(50);
      schedulerView = (
        <View style={[styles.container, {flexDirection: 'row', marginLeft: 20}]}>
          <Text style={iStyle}>Every</Text>
          <Picker
            style={{flex: 1, width: 50}}
            selectedValue={this.state.scheduleValue}
            onValueChange={(
              (x, _) => {
                this.setState({scheduleValue: x})
              }
            ).bind(this)}>
            {numbers}
          </Picker>
          <Text style={iStyle}>days</Text>
        </View>);
      break;
    }
    let textStyle = {
      fontSize: 30
    };
    let textInputStyle = {
      fontSize: 25,
      height: 50,
      marginLeft: 20,
    };
    return(
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View
          style={styles.verticalContainer}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.verticalContainer}>
            <Text style={textStyle}>Company</Text>
            <View style={styles.horizontalContainer}>
              <TextInput
                placeholder="Who should you pay?"
                onChangeText={((x) => {this.setState({valueCompany: x})}).bind(this)}
                value={this.state.valueCompany || ''}
                style={[textInputStyle, {flex: 1, marginRight: 10}]} />
            </View>
          </View>
          <Text style={textStyle}>Bill amount</Text>
          <KeyboardAvoidingView
            keyboardVerticalOffset={0}
            behavior="padding"
            style={styles.horizontalContainer}
            contentContainerStyle={[styles.contentContainer,styles.centered]}>
            <TextInputMask
              type="money"
              style={[textInputStyle, {flex: 1}]}
              ref="billAmount"
              placeholder="$0,00"
              options={{
                unit: '$',
                separator: '.',
                delimiter: ','
              }}
              onChangeText={this.onChangeAmount.bind(this)}
              maxLength={10}
              value={(this.state.amountText || '')}
              />
            <View style={styles.container} />
          </KeyboardAvoidingView>
          <View
            style={[styles.container, {flexDirection: 'row'}]}>
            <Text style={[textStyle, {flex: 1}]}>Period</Text>
            <Picker
              style={{flex: 1}}
              selectedValue={this.state.scheduleType}
              onValueChange={this.onChangeScheduleType.bind(this)}>
              <Picker.Item label="Monthly (regular)" value="Monthly" />
              <Picker.Item label="Monthly (irregular)" value="MonthlyOnWeekday" />
              <Picker.Item label="Fixed interval" value="Fixed" />
            </Picker>
          </View>
          {schedulerView}
        </View>
        <Button onPress={this.submit.bind(this)} title="Done" />
      </ScrollView>
    );
    /*
    <KeyboardAvoidingView
            keyboardVerticalOffset={1000}
            behavior="position"
            style={[styles.container, labeledFormStyle]}
            contentContainerStyle={[styles.contentContainer,styles.centered]}>
            <TextInput
              style={[lStyles.textInput, {minWidth: 100, flex: 1}]}
              placeholder="0"
              maxLength={4}
              keyboardType="numeric"
              options={{
                mask: '9999999999 days',
                translation: {
                  '#': (val) => {
                    return val + ' days'
                  }
                }
              }}
              />
            <Text style={{flex: 1, fontSize: 35}}>days</Text>
          </KeyboardAvoidingView>
    */
  }
};

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