import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import  { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

import api from '../services/api';

export default function Main({ navigation }) {
    const loggedId = navigation.getParam('user');
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);
    useEffect(() => {
        async function loadDevs() {

            const response = await api.get('/devs', {
                headers: {
                    user: loggedId
                }
            });
            
            setUsers(response.data);
            setLoading(false);
        }

        try {        
            loadDevs();
        } catch (error) {
            console.log('Some error happended');

        }

    }, [loggedId, loading]);

    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }
    
    async function handleLike(){
        const [ user, ...rest ] = users;

        await api.post(`/devs/${user._id}/likes`, {}, {
            headers: { user: loggedId }
        });

        setUsers(rest);

    };

    async function handleDislike(){
        const [ user, ...rest ] = users;


        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: loggedId }
        });
        setUsers(rest);
    };
    return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleLogout}>
            <Image style={styles.logo} source={logo}/>
        </TouchableOpacity>

        <View style={styles.cardsContainer}>

        {!loading && users.length == 0 ? (
            <Text style={styles.endText}>Acabou :(</Text>            
        ) : (
            users.map((user, index) => (
                
                <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                    <Image style={styles.avatar} source={{ uri: user.avatar }} />
                    <View style={styles.footer}>
                        <Text style={styles.name}>{user.name != null ? user.name : user.user}</Text>
                        <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                    </View>
                </View>
            ))
        )}
        </View>

        {users.length > 0 ? (
        <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleDislike} style={styles.button}>
                <Image style={styles.buttonsAction} source={dislike} />
            </TouchableOpacity>    
            <TouchableOpacity onPress={handleLike} style={styles.button}>
                <Image style={styles.buttonsAction} source={like} />
            </TouchableOpacity>       
        </View>
        ) : <Text /> }

    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo :{ 
        marginTop: 30
    },
    cardsContainer: {
        flex:1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    button: {
        height:46,
        flex:1,
    },
    card: {
      borderWidth:1,
      borderColor: '#ddd',
      borderRadius: 8,
      margin: 30,
      overflow: 'hidden',
      position: 'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
    },
    avatar: {
        flex:1,
        height:300
    },
    footer:{
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical:15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color : '#999',
        marginTop: 5,
        lineHeight: 18
    }, 
    buttonsContainer:{
        flexDirection: 'row',
        marginBottom: 30,
    },
    button : {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    endText:{
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#999'
    }
});
