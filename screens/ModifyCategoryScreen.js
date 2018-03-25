import React from 'react';
import {
  Picker,
  Text,
  View
} from 'react-native';
import styles from '../constants/Styles.js';

import { TextInputMask } from 'react-native-masked-text';

import * as Model from '../lib/es6/mm/mm_model.js';
import * as Spending_category from '../lib/es6/mm/spending_category.js';

export default class ModifyCategoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.params.category = Model.getCategoryByName(this.params.category.name);
    console.log('this.params: ', this.params);
    this.state = {
      selectedPeriodValue: this.params.category.period,
      amountText: Spending_category.getFormattedAmountString(this.params.category),
      categoryAmount: this.params.category.amount
    };
  }

  onChangeAmount(amt) {
    let x = parseFloat(amt.replace('$', '').replace(',', ''));
    this.setState({categoryAmount: x, amountText: amt})
  }

  render() {
    console.log('Re-rendering...');
    let cat = JSON.parse(JSON.stringify(this.params.category));
    cat.amount = this.state.categoryAmount;
    console.log('Setting new amount to ', cat.amount);
    cat.period = this.state.selectedPeriodValue;
    Model.updateCategory(cat.name, cat);
    return (
      <View
        style={[
          styles.container,
          {padding: 10, maxWidth: '100%'
        }]}>
        <Text style={styles.contentText}>
          This category is currently evaluated with a
        </Text>
        <Picker
          selectedValue={this.state.selectedPeriodValue}
          onValueChange={((selectedPeriodValue) => this.setState({selectedPeriodValue})).bind(this)}
          >
          <Picker.Item label="daily" value={Spending_category.daily} />
          <Picker.Item label="weekly" value={Spending_category.weekly} />
          <Picker.Item label="monthly" value={Spending_category.monthly} />
        </Picker>
        <Text style={styles.contentText}>
          budget of
        </Text>
        <TextInputMask
          type="money"
          style={[styles.textInputStyle, {minWidth: 250}]}
          ref="budgetAmount"
          placeholder="$0,00"
          options={{
            unit: '$',
            separator: '.',
            delimiter: ','
          }}
          onChangeText={this.onChangeAmount.bind(this)}
          maxLength={14}
          value={(this.state.amountText || '')}/>
      </View>);
  }
}