import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';
import {Agenda} from 'react-native-calendars';


export default function HomePage({navigation}) {
    
    return (
        <View style={styles.container}>
            <Text>home page</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        alignItems:"center",
        justifyContent:"space-between"     
    }
})

