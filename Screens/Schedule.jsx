import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Agenda} from 'react-native-calendars';
import apiUrl from '../global';


export default function Schedule({navigation}) {
    const [lessons,setLessons] = useState([]);
    const [items,setItems] = useState("");
    const [id,setId] = useState("");
    const [user_type,setUser_type] = useState("");


    useEffect(() => {
        try{
            AsyncStorage.getItem("@id",(err,result)=>{
                return result !== null ? setId(JSON.parse(result)) : null;
            });

        } catch(e) {
            console.log(e);
        }
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
        setItems(dates);

    },[lessons]);

    const renderItem = (item)=> {
        return (
            <TouchableOpacity
                onPress={() => openViewLesson(item.id)}
             >
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
          </TouchableOpacity>
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

    const openViewLesson=(lesson_id)=>{
        navigation.navigate('ViewLesson',{
            id:id,
            lesson_id:lesson_id,
            user_type:user_type
        });
    }

    return (
        <View style={styles.container}>
            {items!==""?
            <Agenda
                items={items}
                showClosingKnob={true}
                hideKnob={false}
                renderItem={(item) => renderItem(item)}
                renderEmptyDate={() => renderEmptyDate()}
            />:
            null}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        
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


