import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';


export default function Messages({navigation}) {
    return (
        <View style={styles.container}>
            <Text>Messages</Text>
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

