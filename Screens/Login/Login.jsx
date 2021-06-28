import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View, Image,KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Item, Label,CheckBox,Input, Form, ListItem} from 'native-base';
import styles from './style'
import apiUrl from '../../global';
import Ionicons from 'react-native-vector-icons/Ionicons';
import logo from '../../horse-club-logo.png';


export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState("");
    const [allowd,setAllowd]= useState(false);
    const [rememberMe,setRememberMe]= useState(false);
    const [checked, setChecked] = useState(false);
    

    useEffect(() => {
        try{
            AsyncStorage.getItem("@rememberMe",(err,result)=>{
                return result !== null ? setRememberMe(JSON.parse(result)) : null;
            });
            
        } catch(e) {
            console.log(e);
        }
    },[]);

    useEffect(() => {
        if(rememberMe){
            navigation.navigate('HomePage');
            setRememberMe(false);
        }
    },[rememberMe]);

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
                    } else {
                        storeData('rememberMe', false);
                    }
                    setAllowd(true);
                    storeData('email',email);
                }
                return res.json();
            })
            .then((result) => {
                storeData('id', result.id);
                storeData('profileImg', result.profileImg);
                storeData('user', result);
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
                            <View style={styles.inputView}>
                                <Ionicons name='mail-outline' size={20}/>
                                <Input onChangeText={text => setEmail(text)} />
                            </View>
                        </Item>
                        <Item stackedLabel>
                        <Label>סיסמה</Label>
                            <View style={styles.inputView}>
                                <Ionicons name='key-outline' size={20}/>
                                <Input secureTextEntry onChangeText={text => setPassword(text)} />
                            </View>
                        </Item>
                        <ListItem icon style={styles.rememberMe}>
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