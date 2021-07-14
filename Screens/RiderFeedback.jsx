import React, { useState } from 'react';
import { Text,TouchableOpacity,View,StyleSheet,KeyboardAvoidingView,ScrollView} from 'react-native';
import { Form, Item, Input, Label } from 'native-base';
import {AirbnbRating} from 'react-native-ratings';
import apiUrl from '../global';


export default function RiderFeedback({route,navigation}) {
    const {lesson_id} = route.params;
    const [errorMsg, setErrorMsg] = useState(false);
    const [q1, setQ1] = useState("3");
    const [q2, setQ2] = useState("3");
    const [q3, setQ3] = useState("3");
    const [q4, setQ4] = useState("");

    
    const btnSave = () => {
        if(q1==="" || q2==="" || q3==="" || q4 ===""){
            setErrorMsg("*יש למלא את כל השדות במשוב");
        } 
        else {
            setErrorMsg(false);
            let feedback = {
                lesson_id:lesson_id,
                q1:parseInt(q1),
                q2:parseInt(q2),
                q3:parseInt(q3),
                q4:q4
            }
    
            console.log(feedback);
    
            fetch(apiUrl+"Lesson/RiderFeedback",
            {
                method: 'POST',
                body: JSON.stringify(feedback),
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
                navigation.navigate("HomePage");
                },
                (error) => {
                console.log(error);
            });
        }                
    }


    return (
        <View style={{ flex: 1,backgroundColor:"white"}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
              style={{ flex: 1 }}
            >
                <ScrollView
                showsVerticalScrollIndicator={false}
                >
                    <View style={styles.body}>
                        <Form>
                            <Item stackedLabel style={styles.item}>
                                <Label style={styles.labelText}>1.   עד כמה נהנת עם הסוס בשיעור?</Label>
                                <AirbnbRating
                                    onFinishRating={(rating) => setQ1(rating)}
                                    showRating = {false}
                                    defaultRating={3}
                                    size={35}
                                />
                            </Item>
                            <Item stackedLabel style={styles.item}>
                                <Label style={styles.labelText}>2.   עד כמה נהנת בשיעור?</Label>
                                <AirbnbRating 
                                    onFinishRating={(rating) => setQ2(rating)}
                                    defaultRating={3}
                                    showRating = {false}
                                    size={35}
                                />
                            </Item>
                            <Item stackedLabel style={styles.item}>
                                <Label style={styles.labelText}>3.   עד כמה אתה מרגיש שיפור לעומת השיעור הקודם?</Label>   
                                <AirbnbRating 
                                    onFinishRating={(rating) => setQ3(rating)}
                                    defaultRating={3}
                                    showRating = {false}
                                    size={35}
                                />
                            </Item>
                            <Item stackedLabel underline style={{paddingTop: 20}}>
                                <Label>4.   איך היה בשיעור?</Label>
                                <Input onChangeText={text => setQ4(text)} />
                            </Item>
                            {errorMsg&&<Item style={{paddingTop: 20, borderColor: 'transparent'}}>
                                <Text style={{color:"red"}}>{errorMsg}</Text>
                            </Item>}
                            <TouchableOpacity onPress={btnSave} style={styles.btnSave}>
                                <Text style={styles.btnText}>שלח משוב</Text> 
                            </TouchableOpacity>
                        </Form>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
      flex:1,
      justifyContent:"space-between",
    },
    item: {
        paddingTop: 20,
        borderColor: 'transparent'
    },
    labelText:{
        marginBottom:15
    },
    btnSave:{
      width:"30%",
      alignSelf:"center",
      alignItems:"center",
      justifyContent:"center",
      borderRadius:40,
      borderWidth:2,
      borderColor:"green",
      height:40,
      marginTop:30,
      marginBottom:15
    },
    btnText:{
      color:"green",
      fontWeight:"600",
      fontSize:15
    }
});
