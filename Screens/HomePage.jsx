import React, { useState,useRef, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import registerForPushNotificationsAsync from '../registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications';
import {auth} from '../fireB';
import apiUrl, { uplodedPicPath } from '../global';


export default function HomePage({route,navigation}) {
    const [notification,setNotification] = useState("");
    const notificationListener = useRef();
    const [todayLesson,setTodayLesson] = useState(false);
    const [lesson_id,setLesson_id] = useState("");
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [lessons,setLessons] = useState([]);
    const [items,setItems] = useState("");
    const [user,setUser] = useState("");
    

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
                await AsyncStorage.getItem("@user",(err,result)=>{
                    return result !== null ? setUser(JSON.parse(result)) : null;
                });
            });
        
        notificationListener.current=Notifications.addNotificationReceivedListener(notification => {
            console.log(JSON.stringify(notification.request.content.data));
            setNotification(notification.request.content.data);
        });
    },[]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(todayLesson){
                let now = new Date();
                let notificatioTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
                console.log(now.toString());
                console.log(notificatioTime.toString());

                if(now.toString()===notificatioTime.toString()){

                    let pnd = {
                        to: token,
                        title: 'מועדון רכיבה רעננה',
                        body: "התקבלה התראה חדשה",
                        badge: 4,
                        data: { chat_num:0, from_id:"",action:"notification" }
                    };

                    fetch(apiUrl+"AppUser/PushNotification",
                        {
                            method: 'POST',
                            body: JSON.stringify(pnd),
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

                    let not = "";
                    if(user.user_type==="rider"){
                        not = {
                            user_id:id,
                            title:"מילוי משוב",
                            text:"לא לשכוח למלא משוב לגבי השיעור שהיה היום :)",
                            dateStr: now.toLocaleDateString(),
                            timeStr: now.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
                            lesson_id:lesson_id
                        }
                    }
                    else {
                        not = {
                            user_id:id,
                            title:"מילוי משובים",
                            text:"לא לשכוח למלא משוב לשיעורים שהיו היום :)",
                            dateStr: now.toLocaleDateString(),
                            timeStr: now.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
                            lesson_id:lesson_id
                        }
                    }

                    fetch(apiUrl+"AppUser/Notifications/",
                        {
                            method: 'POST',
                            body: JSON.stringify(not),
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
                }
            }
        }, 1000);

        return () => clearInterval(interval);
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

        let dates = {};
        let todayy = new Date();

        if(user.user_type==="rider"){
            lessons.map((lesson)=>{
                let lesson_date = new Date(lesson.date);
                let myToday = new Date(todayy.getFullYear(), todayy.getMonth(), todayy.getDate(), lesson_date.getHours(), lesson_date.getMinutes(), lesson_date.getSeconds());

                if(myToday.toString()===lesson_date.toString()){
                    setTodayLesson(true);
                    setLesson_id(lesson.lesson_id);
                }
                
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

        auth.createUserWithEmailAndPassword(email,id)
        .then(() => {
            console.log('User account created & signed in!');
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use')
                auth.signInWithEmailAndPassword(email,id);

        }).then(()=>{
            auth.onAuthStateChanged((user) => {
                if (user) {
                    user.updateProfile({
                        displayName: user.first_name +" "+user.last_name ,
                        photoURL: uplodedPicPath + user.profileImg
                    });
                } else {
                    console.log('not login');
                }
            });
        });
    }
        
    useEffect(() => {
        if(notification!==""){
            console.log(notification);

            if(notification.action==="chat"){
                navigation.navigate('Chat',{
                    SendToId:notification.from_id,
                    my_id:id,
                    chat_num:notification.chat_num
                });
            }

            if(notification.action==="notification"){
                navigation.navigate('Notifications');
            }
        }
    }, [notification]);

    const renderItem = (item)=> {
        return (
              <Card style={styles.item}>
                  <CardItem>
                          {user.user_type==="rider"?
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

