import React, { useState,useRef, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card, CardItem, Body} from 'native-base';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import registerForPushNotificationsAsync from '../registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications';
import {auth} from '../fireB';
import apiUrl, { uplodedPicPath } from '../global';


export default function HomePage({route,navigation}) {
    const [notification,setNotification] = useState("");
    const [lastMessage,setLastMessage] = useState(false);
    const [lastNotification,setLastNotification] = useState(false);
    const notificationListener = useRef();
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

                await AsyncStorage.getItem("@user",(err,result)=>{
                    return result !== null ? setUser(JSON.parse(result)) : null;
                });
                await AsyncStorage.getItem("@id",(err,result)=>{
                    return result !== null ? setId(JSON.parse(result)) : null;
                });
                await AsyncStorage.getItem("@email",(err,result)=>{
                    return result !== null ? setEmail(JSON.parse(result)) : null;
                });
            });
        
        notificationListener.current=Notifications.addNotificationReceivedListener(notification => {
            console.log(JSON.stringify(notification.request.content.data));
            setNotification(notification.request.content.data);
        });
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

            fetch(apiUrl+"Profile/Message/"+id,
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
                    setLastMessage(result);
                    },
                    (error) => {
                    console.log(error);
                }
            );
            
            fetch(apiUrl+"Profile/Notifications/"+id,
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
                    setLastNotification(result);
                    },
                    (error) => {
                    console.log(error);
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
        }
    },[email]);

    useEffect(()=>{     

        let dates = {};
        let todayy = new Date();

        if(user.user_type==="rider"){
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

    useEffect(() => {
        if(user!==""){
            auth.createUserWithEmailAndPassword(user.email,user.id)
            .then(() => {
                console.log('User account created & signed in!');
                auth.currentUser.updateProfile(
                    {
                        displayName: user.first_name +" "+user.last_name,
                        photoURL: uplodedPicPath + user.profileImg
                    }
                )
                console.log(auth.currentUser);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use'){
                    auth.signInWithEmailAndPassword(user.email,user.id)
                    .then(()=>{
                        auth.currentUser.updateProfile(
                            {
                                displayName: user.first_name +" "+user.last_name,
                                photoURL: uplodedPicPath + user.profileImg
                            }
                        )
                    }).then(()=>{
                        console.log(auth.currentUser);
                    });
                }
            });
        }
    }, [user]);

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
            <View style={styles.topView}>
                <TouchableOpacity onPress={()=> navigation.navigate('UserChats')}>
                    <Card style={styles.cards}>
                        <CardItem>
                            <Ionicons name="mail-outline" size={22} />
                        </CardItem>
                        <CardItem>
                            <Text style={styles.titleText}>הודעה אחרונה</Text>
                        </CardItem>
                        <CardItem cardBody>
                            <Text style={styles.titleText}>{lastMessage && (lastMessage.user_id1===id?lastMessage.user_name2:lastMessage.user_name1)+":  "} </Text>
                        </CardItem>
                        <CardItem cardBody>
                            <Text numberOfLines={1} style={styles.cardText}>{lastMessage && lastMessage.last_message}</Text>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate('Notifications')}>
                    <Card style={styles.cards}>
                        <CardItem>
                            <Ionicons name="notifications-outline" size={22} />
                        </CardItem>
                        <CardItem>
                            <Text style={styles.titleText}>התראה אחרונה</Text>
                        </CardItem>
                        <CardItem cardBody>
                            <Text style={styles.cardText}>{lastNotification && lastNotification.text}</Text>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomView}>
                <View style={styles.nestedBottomView}>
                    <Ionicons name="calendar-sharp" size={22} />
                    <Text style={styles.titleText}>
                        יומן שבועי 
                    </Text>
                </View>
                {items!==""?
                <Agenda
                    items={items}
                    renderItem={(item) => renderItem(item)}
                    renderEmptyDate={() => renderEmptyDate()}
                    hideKnob={true}
                />:null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        display:"flex",
        backgroundColor:"white"   
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    topView:{
        display:"flex",
        width: '100%',
        flexDirection:"row",
        justifyContent:"center",
        marginTop:60
    },
    cards:{
        width:140,
        height:140,
        marginRight:15,
        marginLeft:15,
        padding:10,
        alignItems:"center",
    },
    cardText:{
        fontSize:12
    },
    bottomView:{
        flex:1,
        marginTop:80,
    },
    nestedBottomView:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop:10,
        alignSelf:"center",
    },
    titleText:{
        fontWeight:"bold",
        fontSize:13
    }
})

