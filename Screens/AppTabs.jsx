import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import HomePage from './HomePage';
import Schedule from './Schedule';


const apiUrl="http://proj.ruppin.ac.il/bgroup19/prod/api/";
const Tab = createBottomTabNavigator();


export default function AppTabs() {
    return (
        <Tab.Navigator initialRouteName="HomePage">
            <Tab.Screen name="HomePage" component={HomePage}/>
            <Tab.Screen name="Schedule" component={Schedule}/>
        </Tab.Navigator>
    )
}

