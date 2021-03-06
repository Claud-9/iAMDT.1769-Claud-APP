import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Image, Text, KeyboardAvoidingView, Alert } from "react-native";
import { Icon, Input, Button } from 'react-native-elements';
import axios from 'axios';

import { baseURL } from './baseURL';
import { AuthContext } from "./context";
import { Loading } from './Loading';

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);
  
export const CreateAccount = () => {
    const { signIn, saveDetails } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [enableShift, setEnableShift] = useState(false);

    const [name, setName] = useState();
    const [username, setUsername] = useState();
	const [newPassword, setPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState();

	const validate = useCallback(() => {
		if(!username || !newPassword || !confirmPassword || !name) {
			alert("All the fields are required!");
		} else if(newPassword !== confirmPassword) {
            alert("Confirm password does not match!");
		} else if((newPassword.length < 10) || (confirmPassword.length < 10)) {
			alert("Password need to be at least 10 digits!");
		} else if (!/[!@#$%^&*]/.test(newPassword)) {
			alert("Password must have at least one special character! Eg: !,@,#,$,%,^,&,*");
		} else {
			const user = {
				name: name,
				username: username,
				newPassword: newPassword,
				confirmPassword: confirmPassword
			};
			axios.post(`${baseURL}/users/register`, user)
			.then((res) => {
				let loggedInUser = res.data;
				let userJWT = loggedInUser.token;
				Alert.alert("Welcome","Welcome to ToDoNotes, " + username + "!");
				signIn(userJWT,username,newPassword);
				saveDetails(userJWT,username,newPassword);
			})
			.catch((err) => {
				Alert.alert("Error",`Signin failed! ${err.response.data.msg}`);
			});
		}
	},[name, username, newPassword, confirmPassword]);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1500);
	}, []);

	if (isLoading) {
		return <Loading />;
	}

    return (
        <ScreenContainer>
            {/* <Text>Create Account Screen</Text>
            <Button title="Sign Up" onPress={() => signUp()} /> */}

            <ScrollView>
				<KeyboardAvoidingView behavior="position" enabled={enableShift}>
					<View style={styles.logoView}>
						{/* <Image style={styles.stretch} source={require('../../assets/splash.png')} /> */}
						<Text style={styles.text}>Create Account</Text>
					</View>
					<View style={styles.container}>
						<Input
							placeholder="Name"
							leftIcon={{ type: 'font-awesome', name: 'address-book-o' }}
							onChangeText={(name) => setName(name)}
							value={name}
							containerStyle={styles.formInput}
							onFocus={() => {setEnableShift(false)}}
						/>
						<Input
							placeholder="Username"
							leftIcon={{ type: 'font-awesome', name: 'user-o' }}
							onChangeText={(username) => setUsername(username)}
							value={username}
							containerStyle={styles.formInput}
							onFocus={() => {setEnableShift(false)}}
						/>
						<Input
							placeholder="New Password"
							leftIcon={{ type: 'font-awesome', name: 'key' }}
							onChangeText={(newPassword) => setPassword(newPassword)}
							value={newPassword}
							containerStyle={styles.formInput}
							secureTextEntry={true}
							onFocus={() => {setEnableShift(true)}}
						/>
						<Input
							placeholder="Confirm Password"
							leftIcon={{ type: 'font-awesome', name: 'key' }}
							onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
							value={confirmPassword}
							containerStyle={styles.formInput}
							secureTextEntry={true}
							onFocus={() => {setEnableShift(true)}}
						/>
						<View style={styles.formButton}>
							<Button
								title=" Register"
								onPress={() => validate()}
								icon={ <Icon name='user-plus' type='font-awesome' size={24} color= 'white' />}
								buttonStyle={{ backgroundColor: "#2979FF" }}
							/>
                            {/* <Button title="Sign Up" onPress={() => signUp()} /> */}
						</View>
					</View>
				</KeyboardAvoidingView>
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		marginLeft: 10,
		marginRight: 10,
		marginTop:20
	},
	logoView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
    formInput: {
    },
    formButton: {
		marginBottom: 20,
		marginTop: 20,
		marginLeft: 75,
		marginRight: 75
	},
	formCheckbox: {
        margin: 10,
        backgroundColor: null
	},
	stretch: {
		width: 300,
		height: 100
	},
	text: {
		flex: 1,
		color: '#2979FF',
		fontSize: 25,
		fontWeight: 'bold'
	}
});