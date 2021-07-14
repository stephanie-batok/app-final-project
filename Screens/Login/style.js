import {StyleSheet} from 'react-native';


export default StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        alignItems:"center",
        justifyContent:"space-between"     
    },
    logo:{
        flex:1,
        marginTop:20,
        width:"50%",
        height:"50%",
        resizeMode:"contain",
        alignSelf:"center",
    },
    form:{
        flex:1,
        marginBottom:10,
        justifyContent:"center",
        width:"80%",
    },
    loginBtn:{
        width:"60%",
        backgroundColor:"#5a83b7",
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:25,
        height:50,
        marginTop:25,
        marginBottom:10
    },
    loginText:{
        color:'#fff',
        fontSize:17,
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    },
    inputView:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rememberMe:{
        paddingRight:20,
        paddingTop:20
    }
});