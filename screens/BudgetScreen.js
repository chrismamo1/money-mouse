import Colors from '../constants/Colors';
import React from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
 } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';

import * as Model from '../lib/js/mm/mm_model.js';
import BudgetItem from './BudgetItem';

export default class BudgetScreen extends React.Component {
  static navigationOptions = {
    title: 'Budget'
  };

  constructor(props) {
    super(props);
    let getItems = () => {
      let categories = Model.getCategoriesArray();
      let self = this;
      let items =
        categories.map(
          (nam, i) => {
            console.log('making ', nam);
            return <BudgetItem key={nam + i} mom={self} category={nam} />
          });
      return items;
    };
    this.state = this.state || { items: getItems() };
    this.state.addingCategory = false;
    this.updateCategories = this.updateCategories.bind(this);
    this.pushCategory = this.pushCategory.bind(this);
    this.getItems = getItems;
  }

  updateCategories() {
    let items = this.getItems();
    this.setState({items});
  }

  pushCategory(nam) {
    Model.addCategory(nam);
    this.setState({newCatName: undefined, addingCategory: false});
    this.updateCategories();
  }

  render() {
    let footer, header;
    if (this.state.addingCategory) {
      header = (
        <View style={[styles.horizontalContainer, styles['2tite4me']]}>
          <TextInput
            style={[styles.textInput, {flex: 2}]}
            value={this.state.newCatName || ''}
            onChange={(x) => this.setState({newCatName: x.nativeEvent.text})} />
          <Button
            title="Done"
            style={[styles['2tite4me'], {flex: 1}]}
            onPress={() => this.pushCategory(this.state.newCatName)} />
        </View>);
      footer = <View />;
    } else {
      header = <View />;
      footer = <Button onPress={() => this.setState({addingCategory: true})} title="Add Category" />;
    };
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {header}
        {this.state.items}
        {footer}
      </ScrollView>
    );
  }
}

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
  textInput: {
    fontSize: 20,
    height: 40
  },
  '2tite4me': {
    marginBottom: 20
  }
});