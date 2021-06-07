import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity, StyleSheet, View, Image,KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Item, Label,CheckBox,Input, Form, ListItem} from 'native-base';
import logo from '../horse-club-logo.png';
import apiUrl from '../global';


export default function Login({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id, setId] = useState("");
    const [allowd,setAllowd]= useState(false);
    const [checked, setChecked] = useState(false);
    

    useEffect(() => {
        try{
            AsyncStorage.getItem("@rememberMe",(err,result)=>{
                return result !== null ? setAllowd(JSON.parse(result)) : null;
            });
            
        } catch(e) {
            console.log(e);
        }
    },[]);

    useEffect(() => {
        if(allowd){
            navigation.navigate('HomePage');
            setAllowd(false);
        }
    },[id]);

    const btn_LogIn = () => {
        
        console.log(password+" "+email);

        fetch(apiUrl+"AppUser/"+email+"/"+password,
            {
              method: 'GET',
              headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
              })
            })
            .then(res => {
                if(res.ok){
                    if(checked){
                        storeData('rememberMe', true);
                    }
                    setAllowd(true);
                    storeData('email',email);
                }
                return res.json();
            })
            .then((result) => {
                storeData('id', result);
                setId(result);
                console.log(result);
              },
              (error) => {
                console.log(error);
            }
        );
    }

    const storeData = async(storage_Key,value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(`@${storage_Key}`,jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <Image source={logo} style={styles.logo}/>
                <View style={styles.form}>
                    <Form>
                        <Item stackedLabel>
                            <Label>דואר אלקטרוני</Label>
                            <Input onChangeText={text => setEmail(text)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>סיסמה</Label>
                            <Input onChangeText={text => setPassword(text)} />
                        </Item>
                        <ListItem icon>
                            <CheckBox
                                checked={checked}
                                color="green"
                                onPress={() =>
                                setChecked(!checked)
                                }/>
                            <Text> זכור אותי</Text>
                        </ListItem>
                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={btn_LogIn}
                        >
                            <Text style={styles.loginText}>התחבר</Text>
                        </TouchableOpacity>
                    </Form>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        alignItems:"center",
        justifyContent:"space-between"     
    },
    logo:{
        flex:1,
        width:"40%",
        height:"40%",
        resizeMode:"contain",
        alignSelf:"center",
    },
    form:{
        flex:1,
        justifyContent:"center",
        width:"80%",
    },
    loginBtn:{
        width:"60%",
        backgroundColor:"#428af8",
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:25,
        height:50,
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:'#fff',
        fontSize:17,
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    }
})
