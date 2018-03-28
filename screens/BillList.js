import Colors from '../constants/Colors';
import styles from '../constants/Styles';
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
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CategoryIndicator from '../components/CategoryIndicator.js';

import * as Model from '../lib/es6/mm/mm_model.js';
import * as BillModel from '../lib/es6/mm/bill.js';
import * as PaymentModel from '../lib/es6/mm/payment.js';
import * as MoneyModel from '../lib/es6/mm/money.js';
import * as DateModel from '../lib/es6/mm/date.js';

class Bill extends React.Component {
  constructor(props) {
    super(props);
    let state = {
      name: props.name,
      date: props.date,
      amount: props.amount,
      key: props.billId,
      parent: props.parent,
      paymentObj: props.paymentObj
    };
    this.state = state;
    this.onFinalize = this.onFinalize.bind(this);
  }

  onFinalize() {
    this.state.paymentObj.filled = true;
    Model.finalizePayment(this.state.paymentObj);
    this.state.parent.handleFinalization();
  }

  render() {
    return(
      <View style={[styles.horizontalContainer, styles.centered, {padding: 5}]}>
        <CategoryIndicator categoryName={this.state.paymentObj.category} />
        <View>
          <Text style={styles.bigText}>{this.state.name}</Text>
          <Text style={[styles.smallText, styles.secondaryText]}>
            {DateModel.dateToString(this.state.date)}
          </Text>
        </View>
        <View style={[styles.horizontalContainer, {justifyContent: 'flex-end'}]}>
          <Text style={[styles.contentText, styles.secondaryText, {marginRight: 5}]}>
            {this.state.amount}
          </Text>
        </View>
        <TouchableOpacity
          onPress={this.onFinalize}
          style={{width: 32, height: 32, margin: 0}}>
          <Ionicons name="md-checkmark" size={32} color="green" />
        </TouchableOpacity>
      </View>
    )
  }
}

export default class BillList extends React.Component {
  constructor(props) {
    super(props);
    let bills = Model.getBillsForMonth(props.year, props.month);
    if (props.month == 11) {
      bills = bills.concat(Model.getBillsForMonth(props.year + 1, 0));
    } else {
      bills = bills.concat(Model.getBillsForMonth(props.year, props.month + 1));
    }
    console.log("Making bill list with " + bills.length + " bills");
    this.state = this.state || {};
    this.state.upcoming =
      bills
        .filter((payment, _) => !(payment.filled))
        .sort((a, b) => a.date - b.date);
    this.handleFinalization = this.handleFinalization.bind(this);
    this.parent = props.parent;
  }

  handleFinalization() {
    let props = this.props;
    let bills = Model.getBillsForMonth(props.year, props.month);
    bills = bills.concat(Model.getBillsForMonth(props.year, props.month + 1));
    let upcoming =
      bills
        .filter((payment, _) => !(payment.filled))
        .sort((a, b) => a.date - b.date);
    console.log("Making bill list with " + upcoming.length + " bills");
    console.log(bills);
    this.setState({upcoming});
    this.parent.updateMarks();
  }

  render() {
    let bills =
      this.state.upcoming.map(
        (bill, i) =>
          <Bill
            name={BillModel.getOwedTo(PaymentModel.getBill(bill))}
            date={bill.date}
            amount={MoneyModel.toString(bill.amount)}
            parent={this}
            key={bill.id}
            billId={bill.id}
            paymentObj={bill} />);
    let ids = this.state.upcoming.map((pymnt, _) => pymnt.id);
    console.log('ID\'s:', ids);
    if (bills.length == 0) {
      bills = <Text>No upcoming bills in the next month</Text>;
    }
    return(
      <View>
        <Text style={[styles.contentText, {marginLeft: 5}]}>Upcoming Bills</Text>
        {bills}
      </View>);
  }
}

/*const styles = StyleSheet.create({
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
  },
  veryBigText: {
    fontSize: 40,
    fontWeight: "800"
  }
});*/