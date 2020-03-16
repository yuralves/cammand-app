import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import balanceScreen from '../screens/balanceScreen';
import chargeScreen from '../screens/chargeScreen';
import checkOutScreen from '../screens/checkOut';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const balanceStack = createStackNavigator(
  {
    balance: balanceScreen,
  },
  config
);

balanceStack.navigationOptions = {
  tabBarLabel: 'Ler Comanda',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

balanceStack.path = '';

const chargeStack = createStackNavigator(
  {
    charge: chargeScreen,
  },
  config
);

chargeStack.navigationOptions = {
  tabBarLabel: 'Cobrar valor',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

chargeStack.path = '';

const checkOutStack = createStackNavigator(
  {
    checkOut: checkOutScreen,
  },
  config
);

checkOutStack.navigationOptions = {
  tabBarLabel: 'Fazer check out',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

checkOutStack.path = '';

const tabNavigator = createBottomTabNavigator({
  chargeStack,
  balanceStack,
  checkOutStack,
});

tabNavigator.path = '';

export default tabNavigator;
