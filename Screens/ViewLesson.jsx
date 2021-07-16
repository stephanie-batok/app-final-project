import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Form, Item, Icon } from 'native-base';
import apiUrl from '../global';


export default function ViewLesson({route,navigation}) {
    const { id, lesson_id, user_type} = route.params;
    const [lesson,setLesson] = useState("");
    const [riderFeedbackExists,setRiderFeedbackExists] = useState(true);
    const [instructorFeedbackExists,setInstructorFeedbackExists] = useState(true);
    const [showFeedbackBtn,setShowFeedbackBtn] = useState(false);

    
    useEffect(() => {
        
        fetch(apiUrl+"AppUser/Lesson/"+id+"/"+lesson_id,
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

    useEffect(() => {
        if(lesson!==""){
            let err="";

            if(user_type==="rider"){
                fetch(apiUrl+"Lesson/RiderFeedback/"+lesson_id,
                {
                    method: 'GET',
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    if(res.status!==200){
                        err = true;
                    }
                    return res.json();
                })
                .then((result) => {
                    if(err){
                        setRiderFeedbackExists(false);
                    } else {
                        setRiderFeedbackExists(true);
                    }
                    },
                    (error) => {
                    console.log(error);
                }
            );
            } 
            else {
                fetch(apiUrl+"Lesson/InstructorFeedback/"+lesson_id,
                    {
                        method: 'GET',
                        headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; charset=UTF-8',
                        })
                    })
                    .then(res => {
                        if(res.status!==200){
                            err = true;
                        }
                        return res.json();
                    })
                    .then((result) => {
                        if(err){
                            setInstructorFeedbackExists(false);
                        } else {
                            setInstructorFeedbackExists(true);
                        }
                        },
                        (error) => {
                        console.log(error);
                    }
                );
            }
        }
    },[lesson]);

    useEffect(() => {
        console.log(instructorFeedbackExists);
        console.log(riderFeedbackExists);

        if(!riderFeedbackExists||!instructorFeedbackExists){
            let date = new Date(lesson.date); 
            let today = new Date();

            if(date<=today){
                setShowFeedbackBtn(true);    
            }
        }
    },[riderFeedbackExists,instructorFeedbackExists]);

    const goToRiderFeedback = () => {
        navigation.navigate('RiderFeedback',{
            lesson_id:lesson_id,
            id:id
        });
    }

    const goToInstructorFeedback = () => {
        navigation.navigate('InstructorFeedback',{
            lesson_id:lesson_id,
            id:id
        });
    }

    return (
        <View style={styles.container}>
            <View style={{paddingRight:10, backgroundColor:"#f3f3f4"}}>
                {showFeedbackBtn && user_type==="rider"?
                <TouchableOpacity style={styles.btn} onPress={() => goToRiderFeedback()}>
                    <Text><Ionicons name='md-document-text-outline' size={16}/>
                    {" "}משוב</Text>
                </TouchableOpacity>:null}
                {showFeedbackBtn && user_type==="instructor"?<TouchableOpacity style={styles.btn} onPress={() => goToInstructorFeedback()}>
                <Text><Ionicons name='md-document-text-outline' size={16}/>
                {" "}משוב</Text>
                </TouchableOpacity>:null}
            </View>
            <Form>
                {user_type==="rider"?
                <View style={{alignItems:"right"}}>
                    <Item style={styles.item}>
                        <Icon active name='calendar-sharp' />
                        <Text style={styles.itemLabel}>תאריך: </Text>
                        <Text>{lesson.date}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='time-outline' />
                        <Text style={styles.itemLabel}>שעת התחלה: </Text>
                        <Text>{lesson.start_time}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='time-outline' />
                        <Text style={styles.itemLabel}>שעת סיום: </Text>
                        <Text>{lesson.end_time}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='person-sharp' />
                        <Text style={styles.itemLabel}>מדריך: </Text>
                        <Text>{lesson.instructor_fullName}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='paw-sharp' />
                        <Text style={styles.itemLabel}>סוס: </Text>
                        <Text>{lesson.horse_name}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='location-sharp' />
                        <Text style={styles.itemLabel}>מגרש: </Text>
                        <Text>{lesson.field===""?"-":lesson.field}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='md-information-circle-outline' />
                        <Text style={styles.itemLabel}>סוג שיעור: </Text>
                        <Text>{lesson.lesson_type}</Text>
                    </Item>
                </View>
                :
                <View style={{alignItems:"right"}}>
                    <Item style={styles.item}>
                        <Icon active name='calendar-sharp' />
                        <Text style={styles.itemLabel}>תאריך: </Text>
                        <Text>{lesson.date}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='time-outline' />
                        <Text style={styles.itemLabel}>שעת התחלה: </Text>
                        <Text>{lesson.start_time}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='time-outline' />
                        <Text style={styles.itemLabel}>שעת סיום: </Text>
                        <Text>{lesson.end_time}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='person-sharp' />
                        <Text style={styles.itemLabel}>תלמיד: </Text>
                        <Text>{lesson.rider_fullName}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='paw-sharp' />
                        <Text style={styles.itemLabel}>סוס: </Text>
                        <Text>{lesson.horse_name}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='location-sharp' />
                        <Text style={styles.itemLabel}>מגרש: </Text>
                        <Text>{lesson.field===""?"-":lesson.field}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='md-information-circle-outline' />
                        <Text style={styles.itemLabel}>סוג שיעור:</Text>
                        <Text>{lesson.lesson_type}</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='ribbon-outline' />
                        <Text style={styles.itemLabel}>ציון התאמה לסוס: </Text>
                        <Text>{lesson.match_rank!==null?(parseFloat(lesson.match_rank)*100).toString().substring(0,2):null}%</Text>
                    </Item>
                    <Item style={styles.item}>
                        <Icon active name='ios-chatbox-ellipses-outline' />
                        <Text style={styles.itemLabel}>הערות: </Text>
                        <Text>{lesson.comments}</Text>
                    </Item>
                </View>}
            </Form>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white"
    },
    item: {
        paddingTop: 20,
        borderColor: 'transparent'
    },
    itemLabel:{
        fontWeight:"600",
        paddingRight:10
    },
    btn:{
      width:"20%",
      alignItems:"center",
      alignSelf:"flex-end",
      justifyContent:"center",
      backgroundColor:"white",
      borderWidth:1,
      height:30,
      marginTop:10,
      marginBottom:10,
    },
})
