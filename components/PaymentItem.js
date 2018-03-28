import Colors from '../constants/Colors';
import styles from '../constants/Styles';
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
import CategoryIndicator from './CategoryIndicator.js';

import * as DateModel from '../lib/es6/mm/date.js';
import * as Model from '../lib/es6/mm/mm_model.js';
import * as Money from '../lib/es6/mm/money.js';
import * as Payment from '../lib/es6/mm/payment.js';
import * as Spending_category from '../lib/es6/mm/spending_category.js';

export default class PaymentItem extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    let self = this;
    console.log('payment: ', self.props.payment);
    return(
      <View style={[styles.horizontalContainer]}>
        <CategoryIndicator categoryName={self.props.payment.category} />
        <View>
          <Text>
            {Payment.getRecipient(self.props.payment)}
          </Text>
          <Text>
            {DateModel.dateToString(self.props.payment.date)}
          </Text>
        </View>
        <View>
          <Text>
            {Money.toString(self.props.payment.amount)}
          </Text>
        </View>
      </View>
    )
  }
};