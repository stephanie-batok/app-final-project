import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Content, Button, ListItem, Icon, Left, Body, Right ,Input } from 'native-base';
import { Rating, AirbnbRating } from 'react-native-ratings';
import apiUrl from '../global';


export default function RiderFeedback({navigation}) {
    return (
        <View>
            <Rating
            showRating
            onFinishRating={this.ratingCompleted}
            style={{ paddingVertical: 10 }}
            />
        </View>
    )
}
