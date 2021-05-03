import 'react-native-gesture-handler';
import React,{Component} from 'react';
import {I18nManager } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


import Login from './Screens/Login';
import AppTabs from './Screens/AppTabs';
import Schedule from './Screens/Schedule';
import ViewLesson from './Screens/ViewLesson';
import Notifications from './Screens/Notifications';
import Messages from './Screens/Messages';


const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props){
    super(props);
    I18nManager.forceRTL(true);
  }

  getHeaderTitle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomePage';
  
    switch (routeName) {
      case 'HomePage':
        return 'דף הבית';
      case 'Schedule':
        return 'יומן';
      case 'Notifications':
        return 'התראות';
      case 'Messages':
        return 'הודעות';
    }
  }
  
  render() {
    return (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" options={{headerShown:false}} component={Login}/>
                <Stack.Screen name="HomePage" options={({ route }) => ({ headerTitle: this.getHeaderTitle(route)})} component={AppTabs}/>
                <Stack.Screen name="Schedule" options={{headerTitle:"יומן"}} component={Schedule}/>
                <Stack.Screen name="ViewLesson" options={{headerTitle:"צפייה בשיעור"}} component={ViewLesson}/>
                <Stack.Screen name="Notifications" options={{headerTitle:"התראות"}} component={Notifications}/>
                <Stack.Screen name="Messages" options={{headerTitle:"הודעות"}} component={Messages}/>
            </Stack.Navigator>
          </NavigationContainer>
    )
  }
}

