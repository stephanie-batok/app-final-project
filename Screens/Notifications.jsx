import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';


export default function Notifications({navigation}) {
    return (
        <View style={styles.container}>
            <Text>notifications</Text>
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
