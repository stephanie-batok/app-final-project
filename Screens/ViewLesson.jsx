import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';


export default function ViewLesson({route,navigation}) {

    const { id, lesson_id, user_type} = route.params;
    const [lesson,setLesson] = useState("");

    
    useEffect(() => {
        let apiUrl= "http://proj.ruppin.ac.il/bgroup19/prod/api/AppUser/Lesson/";

        fetch(apiUrl+"/"+id+"/"+lesson_id,
            {
                method: 'GET',
                headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                })
            })
            .then(res => {
                if(!res.ok){
                    alert("שגיאה בטעינת שיעור")
                }
                return res.json();
            })
            .then((result) => {
                setLesson(result);
                },
                (error) => {
                alert(error);
            }
        );
    },[]);

    return (
        <View style={styles.container}>
                <Card style={styles.item}>
                  <CardItem>
                          {user_type==="rider"?
                          <Body>
                            <Text>תאריך: {lesson.date}</Text>
                            <Text>שעת התחלה: {lesson.start_time}</Text>
                            <Text>שעת סיום: {lesson.end_time}</Text>
                            <Text>מדריך: {lesson.instructor_fullName}</Text>
                            <Text>סוס: {lesson.horse_name}</Text>
                            <Text>מגרש: {lesson.field}</Text>
                            <Text>סוג שיעור: {lesson.lesson_type}</Text>
                          </Body>
                          :
                          <Body>
                            <Text>תאריך: {lesson.date}</Text>
                            <Text>שעת התחלה: {lesson.start_time}</Text>
                            <Text>שעת סיום: {lesson.end_time}</Text>
                            <Text>תלמיד: {lesson.rider_fullName}</Text>
                            <Text>סוס: {lesson.horse_name}</Text>
                            <Text>ציון התאמה לסוס: {lesson.match_rank!==null?parseFloat(lesson.match_rank)*100:null}%</Text>
                            <Text>מגרש: {lesson.field}</Text>
                            <Text>הערות: {lesson.comments}</Text>
                          </Body>}
                  </CardItem>
              </Card>
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
        flex:1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    }
})
