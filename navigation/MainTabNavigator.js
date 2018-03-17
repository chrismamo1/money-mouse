import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import CalendarScreen from '../screens/CalendarScreen';
import ReportsScreen from '../screens/ReportsScreen';
import BudgetScreen from '../screens/BudgetScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default TabNavigator(
  {
    Calendar: {
      screen: CalendarScreen,
    },
    Reports: {
      screen: ReportsScreen,
    },
    Budget: {
      screen: BudgetScreen,
    },
    Settings: {
      screen: SettingsScreen,
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Calendar':
            iconName = 'md-calendar';
            break;
          case 'Reports':
            iconName = 'md-clipboard';
            break;
          case 'Budget':
            iconName = 'md-cash';
            break;
          case 'Settings':
            iconName = 'md-settings';
            break;
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    activeTintColor: Colors.tabIconSelected,
    inactiveTintColor: Colors.tabIconDefault,
  }
);
