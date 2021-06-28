import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomePage from './HomePage';
import Schedule from './Schedule';
import Notifications from './Notifications';
import UserChats from './UserChats';


const apiUrl="http://proj.ruppin.ac.il/bgroup19/prod/api/";
const Tab = createBottomTabNavigator();


export default function AppTabs() {
    return (
        <Tab.Navigator initialRouteName="HomePage"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'HomePage') {
                    iconName = focused ? 'home': 'home-outline';
                } else if (route.name === 'Schedule') {
                    iconName = focused ? 'calendar' : 'calendar-sharp';
                } else if (route.name === 'Notifications') {
                    iconName = focused ? 'notifications' : 'notifications-outline';
                } else if (route.name === 'UserChats') {
                    iconName = focused ? 'mail' : 'mail-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: '#00adf5',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="HomePage" options={{tabBarLabel:'דף הבית'}} component={HomePage}/>
            <Tab.Screen name="Schedule" options={{tabBarLabel:'יומן'}} component={Schedule}/>
            <Tab.Screen name="Notifications" options={{tabBarLabel:'התראות'}} component={Notifications}/>
            <Tab.Screen name="UserChats" options={{tabBarLabel:'הודעות'}} component={UserChats}/>
        </Tab.Navigator>
    )
}

