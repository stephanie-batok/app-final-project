import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import registerForPushNotificationsAsync from '../registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications';
import {auth} from '../fireB';
import apiUrl from '../global';


export default function HomePage({route}) {
    const [notification,setNotification] = useState();
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");

    const [lessons,setLessons] = useState([]);
    const [items,setItems] = useState("");
    const [user_type,setUser_type] = useState("");
    

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(async(tok) => {
                AsyncStorage.setItem(`@token`,JSON.stringify(tok));
                setToken(tok);

                await AsyncStorage.getItem("@id",(err,result)=>{
                    return result !== null ? setId(JSON.parse(result)) : null;
                });
                await AsyncStorage.getItem("@email",(err,result)=>{
                    return result !== null ? setEmail(JSON.parse(result)) : null;
                });
                
            });

        // Handle notifications that are received or selected while the app
        // is open. If the app was closed and then opened by tapping the
        // notification (rather than just tapping the app icon to open it),
        // this function will fire on the next tick after the app starts
        // with the notification data.
        this._notificationSubscription = Notifications.addNotificationReceivedListener(_handleNotification);
    },[]);

    useEffect(() => {
        if(id!==""){
            fetch(apiUrl+"AppUser/Lessons/"+id,
                {
                    method: 'GET',
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    if(!res.ok){
                        alert("שגיאה בטעינת שיעורים")
                    }
                    return res.json();
                })
                .then((result) => {
                    if(result.length!==0){
                        setLessons(result);
                        console.log(result);
                    }
                    },
                    (error) => {
                    alert(error);
                }
            );
        }
    },[id]);

    useEffect(() => {
        if(token!=""){
            console.log(token);
            fetch(apiUrl+"AppUser/Token/"+id,
                {
                    method: 'PUT',
                    body: JSON.stringify(token),
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    return res.json();
                })
                .then((result) => {
                    console.log(result);
                    },
                    (error) => {
                    console.log(error);
                }
            );  
            register();          
        }
    },[email]);

    useEffect(()=>{
        
        let userType="";
        lessons.map((lesson)=>{
            if(lesson.rider_id===id){
                userType="rider";
            }
            else{
                userType="instructor";
            }
        });

        setUser_type(userType);
        
        let dates = {};

        if(userType==="rider"){
            lessons.map((lesson)=>{
                dates[lesson.date]=[{
                    "name":lesson.instructor_fullName,
                    "time":lesson.start_time+" - "+lesson.end_time,
                    "horse":lesson.horse_name,
                    "field":lesson.field,
                    "id":lesson.lesson_id,
                    "lesson_type":lesson.lesson_type
                }];
            });
        }
        else {
            lessons.map((lesson)=>{
                if(dates[lesson.date]===undefined){
                    dates[lesson.date] = [{
                        "name":lesson.rider_fullName,
                        "time":lesson.start_time+" - "+lesson.end_time,
                        "horse":lesson.horse_name,
                        "field":lesson.field,
                        "id":lesson.lesson_id,
                        "lesson_type":lesson.lesson_type
                    }];
                }
                else{
                    dates[lesson.date].push({
                        "name":lesson.rider_fullName,
                        "time":lesson.start_time+" - "+lesson.end_time,
                        "horse":lesson.horse_name,
                        "field":lesson.field,
                        "id":lesson.lesson_id,
                        "lesson_type":lesson.lesson_type
                    });
                }
            });
        }

        let today = new Date().toISOString().split('T')[0];

        if(dates[today]===undefined)
            dates[today]=[];
    
        setItems(dates);

    },[lessons]);

    const register = () => {
        auth.onAuthStateChanged((user)=>{
            if (user) {
              auth.signInWithEmailAndPassword(user.email,id);

            } else {
            //   auth.createUserWithEmailAndPassword(email,id);
            }
        });
    }

    const _handleNotification = (notification) => {
        setNotification(notification.data);
        console.log(notification.data);
        
        if(notification.data.action==="chat"){
            navigation.navigate('Chat',{
                SendToId:notification.data.from_id,
                my_id:id,
                chat_num:notification.data.chat_num
            });
        }
    };

    const renderItem = (item)=> {
        return (
              <Card style={styles.item}>
                  <CardItem>
                          {user_type==="rider"?
                          <Body>
                            <Text>מדריך: {item.name}</Text>
                            <Text>שעה: {item.time}</Text>
                            <Text>סוס: {item.horse}</Text>
                            <Text>מגרש: {item.field}</Text>
                            <Text>סוג שיעור: {item.lesson_type}</Text>
                          </Body>
                          :
                          <Body>
                            <Text>תלמיד: {item.name}</Text>
                            <Text>שעה: {item.time}</Text>
                            <Text>סוס: {item.horse}</Text>
                            <Text>מגרש: {item.field}</Text>
                            <Text>סוג שיעור: {item.lesson_type}</Text>
                          </Body>}
                  </CardItem>
              </Card>
        );
    }

    const renderEmptyDate = () => {
        return (
              <Card style={styles.item}>
                  <CardItem>
                          <Body>
                              <Text>לא נמצאו שיעורים להיום :)</Text>
                          </Body>
                  </CardItem>
              </Card>
        );
    }
    
    return (
        <View style={styles.container}>
            {items!==""?<Agenda
                items={items}
                renderItem={(item) => renderItem(item)}
                renderEmptyDate={() => renderEmptyDate()}
                hideKnob={true}
            />:null}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white"   
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    }
})

