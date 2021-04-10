import 'react-native-gesture-handler';
import React,{Component} from 'react';
import {I18nManager } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Login from './Screens/Login';
import AppTabs from './Screens/AppTabs';
import Schedule from './Screens/Schedule';
import ViewLesson from './Screens/ViewLesson';


const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor(props){
    super(props);
    I18nManager.forceRTL(true);
  }
  
  render() {
    return (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" options={{headerShown:false}} component={Login}/>
                <Stack.Screen name="HomePage" component={AppTabs}/>
                <Stack.Screen name="Schedule" component={Schedule}/>
                <Stack.Screen name="ViewLesson" component={ViewLesson}/>
            </Stack.Navigator>
          </NavigationContainer>
    )
  }
}

