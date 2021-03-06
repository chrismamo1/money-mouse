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
import { StackNavigator } from 'react-navigation';

import * as Model from '../lib/es6/mm/mm_model.js';
import BudgetItem from './BudgetItem';
import ModifyCategoryScreen from './ModifyCategoryScreen.js';

class MainBudgetScreen extends React.Component {
  static navigationOptions = {
    title: 'Budget',
    header: null
  };

  constructor(props) {
    super(props);
    let self = this;
    let getItems = () => {
      let categories = Model.getCategoriesArray();
      console.log('Categories: ', categories);
      let items =
        categories.map(
          (nam, i) => {
            console.log('making ', nam);
            return <BudgetItem key={nam.name} mom={self} category={nam} parent={self} />
          });
      return items;
    };
    this.state = this.state || { items: getItems() };
    this.state.addingCategory = false;
    this.updateCategories = this.updateCategories.bind(this);
    this.pushCategory = this.pushCategory.bind(this);
    this.getItems = getItems.bind(this);
    //console.log('this.props.navigation: ', this.props.navigation);
    //this.props.navigation.addListener('willFocus', ((x) => self.updateCategories()));
  }

  updateCategories() {
    let items = this.getItems();
    this.setState({items});
  }

  pushCategory(nam) {
    Model.addCategory(nam);
    this.updateCategories();
    this.setState({newCatName: undefined, addingCategory: false});
  }

  render() {
    console.log('this.props.navigation: ', this.props.navigation);
    let footer, header;
    if (this.state.addingCategory) {
      header = (
        <View style={[styles.horizontalContainer, styles['2tite4me']]}>
          <TextInput
            style={[styles.textInput, {flex: 2}]}
            value={this.state.newCatName || ''}
            onChangeText={(x, _) => this.setState({newCatName: x})} />
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
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {header}
        {this.state.items}
        {footer}
      </ScrollView>
    );
  }
}

let BudgetScreen = StackNavigator(
  {
    MainBudgetScreen: {
      screen: MainBudgetScreen,
    },
    ModifyCategoryScreen: {
      screen: ModifyCategoryScreen,
    }
  }
);

export default BudgetScreen;

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