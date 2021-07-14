import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, FlatList} from 'react-native';
import {ListItem, Right,Left, Body, Icon } from 'native-base';
import apiUrl from '../global';


export default function Notifications({navigation}) {
    const [user,setUser] = useState("");
    const [notifications,setNotifications] = useState([]);

    
    useEffect(() => {
        AsyncStorage.getItem("@user",(err,result)=>{
            return result !== null ? setUser(JSON.parse(result)) : null;
        });
    },[]);


    useEffect(() => {

        if(user!==""){
            fetch(apiUrl+"AppUser/Notifications/"+user.id,
                {
                    method: 'GET',
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    return res.json();
                })
                .then((result) => {
                    if(result.lenght!==0){
                        setNotifications(result);
                    }
                    },
                    (error) => {
                    console.log(error);
                }
            );
        }
    }, [user]);

    renderItem = ({ item }) => {
        let dateTime="";
        let day = new Date().getDate();
        let month = new Date().getMonth();
        let year = new Date().getFullYear();
        let date = day + "." + (month+1) + "." + year;

        if(date===item.dateStr){
            dateTime = item.timeStr;
        }
        else {
            dateTime = item.dateStr;
        }

        return (
            <ListItem onPress={go2Schedule(item.lesson_id)}>
                <Body style={{alignItems:'flex-start',borderColor:"transparent"}}>
                    <Text style={{fontSize: 15,fontWeight:'bold',paddingBottom:10}} >{item.title}</Text>
                    <Text style={{fontSize: 13}} note>{item.text}</Text>
                </Body>
                <Right style={{borderColor:"transparent"}}>
                    <Text style={{fontSize: 11,borderColor:"transparent"}}>{dateTime}</Text>
                </Right>
            </ListItem>
        );
    };

    const go2Schedule = (lesson_id) => e => {
        if(user.user_type === "rider"){
            navigation.navigate('ViewLesson',{
                id:user.id,
                lesson_id:lesson_id,
                user_type:user.user_type
            });
        } 
        else {
            navigation.navigate('Schedule');
        }
    }

    return (
        <FlatList
            data={notifications}
            renderItem={this.renderItem}
            keyExtractor={item => item.notification_id.toString()}
        >
        </FlatList>
    )
}
