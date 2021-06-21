import 'react-native-gesture-handler';
import React,{Component} from 'react';
import {I18nManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


import Login from './Screens/Login/Login';
import AppTabs from './Screens/AppTabs';
import Schedule from './Screens/Schedule';
import ViewLesson from './Screens/ViewLesson';
import Notifications from './Screens/Notifications';
import Chat from './Screens/Chat';
import UserChats from './Screens/UserChats';
import ContactList from './Screens/ContactList';
import Profile from './Screens/Profile';
import RiderFeedback from './Screens/RiderFeedback';


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
      case 'UserChats':
        return 'הודעות';
    }
  }

  getHeaderRight = (route,navigation) => e => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomePage';
  
    switch (routeName) {
      case 'HomePage':
        return <Ionicons style={{fontSize: 35, paddingRight:15}} onPress={() => navigation.navigate('Profile')} name="ios-person-circle-outline"/>;
      case 'UserChats':
        return <Ionicons style={{fontSize: 30, paddingRight:15}} onPress={() => navigation.navigate('ContactList')} name="create-outline"/>;
    }
  }

  getHeaderLeft = (route,navigation) => e => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomePage';
  
    switch (routeName) {
      case 'HomePage':
        return <Ionicons style={{fontSize: 30, paddingLeft:15}} onPress={() => {
          AsyncStorage.multiRemove(["@id","@user","@rememberMe","@email"]);
          navigation.navigate('Login');          
        }} name="log-out-outline"/>;
    }
  }
  
  render() {
    return (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" options={{headerShown:false}} component={Login}/>
                <Stack.Screen name="HomePage" options={({ route, navigation }) => ({ headerTitle: this.getHeaderTitle(route), headerLeft:this.getHeaderLeft(route,navigation), headerRight:this.getHeaderRight(route,navigation)})} component={AppTabs}/>
                <Stack.Screen name="Schedule" options={{headerTitle:"יומן"}} component={Schedule}/>
                <Stack.Screen name="ViewLesson" options={{headerTitle:"צפייה בשיעור"}} component={ViewLesson}/>
                <Stack.Screen name="Notifications" options={{headerTitle:"התראות"}} component={Notifications}/>
                <Stack.Screen name="UserChats" options={{title:"הודעות"}}  component={UserChats}/>
                <Stack.Screen name="Chat" options={{headerTitle:"הודעה"}} component={Chat}/>
                <Stack.Screen name="ContactList" options={{headerTitle:"אנשי קשר"}} component={ContactList}/>
                <Stack.Screen name="Profile" options={{headerTitle:"פרופיל אישי"}} component={Profile}/>
                <Stack.Screen name="RiderFeedback" options={{headerTitle:"משוב שיעור"}} component={RiderFeedback}/>
            </Stack.Navigator>
          </NavigationContainer>
    )
  }
}

