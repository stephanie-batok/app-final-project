import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet,Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Content, Button, ListItem, Icon, Left, Body, Right ,Input } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import {apiUrl,uplodedPicPath} from '../global';


export default function Profile({navigation}) {
    const [photoUri, setPhotoUri] = useState("");
    const [photoPath, setPhotoPath] = useState("");
    const [user, setUser] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    useEffect(() => {
      AsyncStorage.getItem("@user",(err,result)=>{
      return result !== null ? setUser(JSON.parse(result)) : null;
      });
    }, []);

    useEffect(() => {
      if(user!==""){
        console.log(uplodedPicPath+user.profileImg);
        setId(user.id);
        setEmail(user.email);
        setPhone_number(user.phone_number);
        setPassword(user.password);
        setPhotoUri(uplodedPicPath+user.profileImg);
      }
    }, [user]);

    btnUploadPhoto = async() => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
  
      let pickerResult = await ImagePicker.launchImageLibraryAsync(
        {
          allowsEditing: true,
          aspect: [4, 3],
        }
      );

      let imgName = 'profile.jpg';
      console.log(pickerResult.uri);

      if(pickerResult.uri!==undefined){
        setPhotoUri(pickerResult.uri);
        imageUpload(pickerResult.uri, imgName);
      }
    }

    const btnSave = () => {

      if(newPassword!==repeatPassword){
        setNewPassword("");
        setRepeatPassword("");
        alert("יש לחזור על הסיסמה החדשה פעם נוספת.")
      }
      else {
        let profilePassword;
        if(newPassword.trim()===""){
          profilePassword = password;
        }
        else {
          profilePassword = newPassword;
        }
  
        let profile = {
          "phone_number":phone_number,
          "email": email,
          "password":profilePassword,
          "profileImg": photoPath
        };

        console.log(profile);
        console.log(id);
        
        fetch("http://proj.ruppin.ac.il/bgroup19/prod/api/AppUser/Profile/"+id,
          {
              method: 'PUT',
              body: JSON.stringify(profile),
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
              alert(result);
            },
            (error) => {
            console.log(error);
            alert(error);
          }
        );
      }
    }

    const imageUpload = async(imgUri, picName) => {
      let urlAPI = "http://proj.ruppin.ac.il/bgroup19/prod/api/AppUser/PostPic";
      let dataI = new FormData();
      dataI.append('picture', {
        uri: imgUri,
        name: picName,
        type: 'image/jpg'
      });

      const config = {
        method: 'POST',
        body: dataI,
        headers: {
            'Accept': "application/json",
            'Content-Type': 'multipart/form-data',
        }
      };
  
      await fetch(urlAPI, config)
        .then((res) => {
          console.log('res.status=', res.status);
          if (res.status == 201) {
            return res.json();
          }
          else {
            console.log('error uploding ...');
            return "err";
          }
        })
        .then((responseData) => {
          console.log(responseData);
          if (responseData != "err") {
            let picNameWOExt = picName.substring(0, picName.indexOf("."));
            let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt), responseData.indexOf(".jpg") + 4);
            setPhotoPath(imageNameWithGUID);
            setPhotoUri(uplodedPicPath+imageNameWithGUID);
            console.log("img uploaded successfully!");
          }
          else {
            console.log('error uploding ...');
          }
        })
        .catch(err => {
          console.log('err upload= ' + err);
        });
    }

    return (
        <View style={{flex:1}}>
            <View style={styles.header}/>
            <Image style={styles.avatar} source={{uri:photoUri}}/>
            <View style={styles.body}>
                <TouchableOpacity onPress={btnUploadPhoto} style={styles.btnUplodePic}>
                  <Text>בחר תמונה</Text> 
                </TouchableOpacity>
                <ListItem itemDivider>
                  <Text>מידע אישי</Text>
                </ListItem>
                <ListItem icon>
                    <Left>
                      <Ionicons name='mail-outline' size={20}/>
                    </Left>
                    <Body>
                      <Input placeholder={email} onChangeText={text => setEmail(text)} />
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left>
                      <Ionicons name='ios-call-outline' size={20}/>
                    </Left>
                    <Body>
                      <Input placeholder={phone_number} onChangeText={text => setPhone_number(text)} />
                    </Body>
                </ListItem>
                <ListItem itemDivider>
                    <Text>שינוי סיסמה</Text>
                </ListItem>
                <ListItem icon>
                    <Left>
                      <Ionicons name='lock-closed-outline' size={20}/>
                    </Left>
                    <Body>
                      <Input placeholder="הקלד סיסמה חדשה" secureTextEntry onChangeText={text => setNewPassword(text)} />
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left>
                      <Ionicons name='lock-closed-outline' size={20}/>
                    </Left>
                    <Body>
                      <Input placeholder="חזור על הסיסמה" secureTextEntry onChangeText={text => setRepeatPassword(text)} />
                    </Body>
                </ListItem>
                  <TouchableOpacity onPress={btnSave} style={styles.btnSave}>
                      <Text style={styles.btnText}>שמור</Text> 
                  </TouchableOpacity>
              </View>
        </View>
    )
}


const styles = StyleSheet.create({
    header:{
      backgroundColor: "gray",
      height:150,
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: "white",
      marginBottom:10,
      alignSelf:'center',
      position: 'absolute',
      marginTop:80
    },
    body:{
      marginTop:70,
    },
    bodyContent: {
      padding:30,
    },
    btnSave:{
      width:"20%",
      alignSelf:"center",
      alignItems:"center",
      justifyContent:"center",
      borderRadius:40,
      borderWidth:2,
      borderColor:"green",
      height:30,
      marginTop:15,
      marginBottom:15
    },
    btnText:{
      color:"green"
    },
    btnUplodePic:{
      width:"20%",
      alignSelf:"center",
      alignItems:"center",
      justifyContent:"center",
      borderWidth:2,
      height:30,
      marginTop:15,
      marginBottom:15
    },
});
