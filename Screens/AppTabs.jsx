import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomePage from './HomePage';
import Schedule from './Schedule';


const apiUrl="http://proj.ruppin.ac.il/bgroup19/prod/api/";
const Tab = createBottomTabNavigator();


export default function AppTabs() {
    return (
        <Tab.Navigator initialRouteName="HomePage"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'HomePage') {
                    iconName = focused
                    ? 'home'
                    : 'home-outline';
                } else if (route.name === 'Schedule') {
                    iconName = focused ? 'calendar' : 'calendar-sharp';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'blue',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="HomePage" options={{tabBarLabel:'דף הבית'}} component={HomePage}/>
            <Tab.Screen name="Schedule" options={{tabBarLabel:'יומן'}} component={Schedule}/>
        </Tab.Navigator>
    )
}

