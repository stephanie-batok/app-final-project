import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Agenda} from 'react-native-calendars';


export default function Schedule({navigation}) {

    const [lessons,setLessons] = useState([])
    const [items,setItems] = useState("");
    const [id,setId] = useState("");


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
            let apiUrl= "http://proj.ruppin.ac.il/bgroup19/prod/api/AppUser/Lessons/";

            fetch(apiUrl+"/"+id,
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
                    setLessons(result);
                  },
                  (error) => {
                    alert(error);
                }
            );
        }

    },[id]);

    useEffect(()=>{

        let dates = {};
        lessons.map((lesson)=>{
            dates[lesson.date]=[{
                "name":lesson.instructor_fullName,
                "time":lesson.start_time+" - "+lesson.end_time,
                "horse":lesson.horse_name,
                "field":lesson.field
            }];       
        });
        setItems(dates);

    },[lessons]);



    const renderItem = (item)=> {
        return (
            // <ScheduleItem item={item}/>       
            <TouchableOpacity
                onPress={() => alert(item.name)}
             >
              <Card style={styles.item}>
                  <CardItem>
                          <Body>
                            <Text>מדריך: {item.name}</Text>
                            <Text>שעה: {item.time}</Text>
                            <Text>סוס: {item.horse}</Text>
                            <Text>מגרש: {item.field}</Text>
                          </Body>
                  </CardItem>
              </Card>
          </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Text>Schedule</Text>
            {items!==""?<Agenda
                items={items}
                renderItem={(item) => renderItem(item)}
            />:null}
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


