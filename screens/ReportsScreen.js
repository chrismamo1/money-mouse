import Colors from '../constants/Colors';
import React from 'react';
import { View, StyleSheet, Text, ScrollView, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';
import PieChart from 'react-native-pie-chart';
import { StackNavigator } from 'react-navigation';

import * as BillModel from '../lib/es6/mm/bill.js';
import * as DateModel from '../lib/es6/mm/date.js';
import * as Model from '../lib/es6/mm/mm_model.js';
import * as MoneyModel from '../lib/es6/mm/money.js';
import * as Spending_category from '../lib/es6/mm/spending_category.js';

import CategoryIndicator from '../components/PaymentItem.js';
import PaymentItem from '../components/PaymentItem.js';

console.log('DateModel: ' + DateModel);

class ReportViewScreen extends React.Component {
  static navigationOptions = {
    title: 'View Reports'
  };

  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    let now = new Date();
    let state = {};
    state.period = params.period;
    state.today = DateModel.make(now.getFullYear(), now.getMonth(), now.getDate());
    this.state = state;
  }

  render() {
    let period = Spending_category.period_of_string(this.state.period);
    let periodSummaryText = Spending_category.summarizePeriod(this.state.today, period);
    let payments = Model.getPaymentsForPeriod(this.state.today, period);
    if (payments.length > 0) {
      let parts =
        payments
          .reduce(
            (acc, x, _) => {
              acc[x.category] = (acc[x.category] || 0.0) + MoneyModel.getAmount(x.amount);
              return acc
            },
            {},
            payments);
      console.log('Parts: ', parts);
      let series = [], colours = [];
      let legend = [];
      for (let i in parts) {
        let s = {
          backgroundColor: Model.getCategoryColor(i),
          width: 30,
          height: 30,
          margin: 5
        };
        series.push(parts[i]);
        colours.push(Model.getCategoryColor(i));
        let str = MoneyModel.toString(MoneyModel.makeUsd(parts[i]));
        legend.push(
          <View>
            <CategoryIndicator categoryName={i} />
            <Text>{i}</Text>
          </View>);
          /*<View
            key={i}
            style={[styles.horizontalContainer, {flex: 5}]}>
            <View style={s} />
            <Text style={{fontSize: 30, flex: 2}}>{i} ({str})</Text>
          </View>*/
      }
      let paymentsElements = payments.map((x) => {
        return <PaymentItem key={x.id} payment={x} />
      });
      content = (
        <ScrollView contentContainerStyle={styles.centered}>
          <Text style={styles.bigText}>{periodSummaryText}</Text>
          <PieChart
            chart_wh={300}
            series={series}
            sliceColor={colours}
            />
          {legend}
          {paymentsElements}
        </ScrollView>);
    } else {
      content = <Text>No payments found during this period</Text>;
    }
    return(
      <View
        style={[styles.contentContainer]}
        contentContainerStyle={styles.centered}>
        {content}
      </View>);
  }
}

class ReportSelectionScreen extends React.Component {
  static navigationOptions = {
    title: 'Reports',
  };

  render() {
    let navi = this.props.navigation.navigate;
    let styles2 = StyleSheet.create({button: {
      fontSize: 30,
      margin: 15,
      padding: 15,
      flex: 1,
    }});
    return (
      <View style={styles.container} contentContainerStyle={[]}>
        <Button style={styles2.button} onPress={() => navi('ReportViewScreen', {period: "Daily"})} title="Daily" />
        <Button style={styles2.button} onPress={() => navi('ReportViewScreen', {period: "Weekly"})} title="Weekly" />
        <Button style={styles2.button} onPress={() => navi('ReportViewScreen', {period: "Monthly"})} title="Monthly" />
      </View>
    );
  }
}

let ReportsScreen = StackNavigator(
  {
    ReportSelectionScreen: {
      screen: ReportSelectionScreen,
    },
    ReportViewScreen: {
      screen: ReportViewScreen
    }
  }
);

export default ReportsScreen;

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
  },
  veryBigText: {
    fontSize: 40,
    fontWeight: "800"
  }
});
