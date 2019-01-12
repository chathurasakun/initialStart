import React, { Component } from 'react';
import { Alert, ActivityIndicator, Image, Text, TextInput, TouchableHighlight, View, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Images from '../utils/images';
import styles from './styles/Style';
import baseUrl from '../config/baseUrl';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Button } from 'native-base';

class Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            emailError: '',
            passError: '',
            isFetching: false
        };
    }

    registerUser = () => {
        if (this.state.firstName !== '' && this.state.lastName !== '' && this.state.email !== '' && this.state.password !== '' && this.state.emailError === '' && this.state.passError === '') {
            const data = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password
            }
            this.setState({ isFetching: true }, () => {
                fetch(`${baseUrl.url}register`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.resultStatus === 'SUCCESSFUL') {
                            this.setState({ isFetching: false }, () => {
                                Alert.alert(
                                    'Registration Successful!',
                                    `${responseJson.message.message}`,
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Ok',
                                            onPress: () => Actions.login(),
                                        },
                                    ]
                                );
                            });
                        }
                        else {
                            this.setState({ isFetching: false }, () => {
                                Alert.alert(
                                    'Registration Unsuccessful!',
                                    `${responseJson.message.message}`,
                                    [
                                        {
                                            text: 'Ok',
                                            onPress: console.log('ok pressesd'),
                                        },
                                    ],
                                    { cancelable: false }
                                );
                            });
                        }
                    });
            });
        }
        else {
            if (this.state.password === '') {
                this.setState({
                    passError: 'Pls. enter at least 6 characters'
                });
            }
            if (this.state.email === '') {
                this.setState({
                    emailError: 'Please enter a valid Email address'
                });
            }
        }
    }

    validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            this.setState({
                email: text,
                emailError: 'Please enter a valid Email address'
            });
            return false;
        }
        else {
            this.setState({
                email: text,
                emailError: ''
            });
        }
    }

    validatePassword = (text) => {
        // let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        // if (reg.test(text) === false) {
        //     this.setState({
        //         password: text,
        //         passError: 'Pls. enter at least 6 Alpha-Numeric characters'
        //     });
        // }
        // else {
        //     this.setState({
        //         password: text,
        //         passError: ''
        //     });
        // }
        if (text.length < 6) {
            this.setState({
                password: text,
                passError: 'Pls. enter at least 6 characters'
            });
        }
        else {
            this.setState({
                password: text,
                passError: ''
            });
        }
    }

    render = () => {
        return (
            <Container>
                {/* <KeyboardAvoidingView behavior='position'> */}
                <View style={{ flexDirection: 'row' }}>
                    {(Dimensions.get('window').width === 768 || Dimensions.get('window').width === 834) ?
                        <Image
                            source={Images.splashScreen4}
                            style={{
                                height: hp('100%'),
                                width: wp('100%'),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        />
                        :
                        (Dimensions.get('window').width === 1024) ?
                            <Image
                                source={Images.splashScreen5}
                                style={{
                                    height: hp('100%'),
                                    width: wp('100%'),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            />
                            :
                            <Image
                                source={Images.splashScreen2}
                                style={{
                                    height: hp('100%'),
                                    width: wp('100%'),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            />
                    }
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            alignItems: 'center'
                        }}
                    >
                        <View style={{ top: hp('24%') }}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputs}
                                    editable={true}
                                    placeholder='First Name'
                                    placeholderTextColor='#BBBDC0'
                                    ref='firstname'
                                    keyboardType='email-address'
                                    underlineColorAndroid='transparent'
                                    onChangeText={(firstName) => this.setState({ firstName })}
                                    value={this.state.firstName}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputs}
                                    editable={true}
                                    placeholder='Last Name'
                                    placeholderTextColor='#BBBDC0'
                                    ref='lastname'
                                    returnKeyType='next'
                                    underlineColorAndroid='transparent'
                                    onChangeText={(lastName) => this.setState({ lastName })}
                                    value={this.state.lastName}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputs}
                                    editable={true}
                                    placeholder='Email Address'
                                    placeholderTextColor='#BBBDC0'
                                    ref='email'
                                    returnKeyType='next'
                                    underlineColorAndroid='transparent'
                                    onChangeText={(email) => this.validateEmail(email)}
                                    value={this.state.email}
                                />
                            </View>
                            <Text style={{ color: '#FF2F2F', fontSize: hp('1.9%') }}>{this.state.emailError}</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputs}
                                    editable={true}
                                    placeholder='Password'
                                    placeholderTextColor='#BBBDC0'
                                    ref='password'
                                    returnKeyType='next'
                                    secureTextEntry={true}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(password) => this.validatePassword(password)}
                                    value={this.state.password}
                                />
                            </View>
                            <Text style={{ color: '#FF2F2F', fontSize: hp('1.9%') }}>{this.state.passError}</Text>
                        </View>

                        <View style={{ top: hp('26%') }}>
                            <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.registerUser()}>
                                <Text style={styles.loginText}>Register</Text>
                            </TouchableHighlight>
                        </View>

                        <View style={{ flexDirection: 'row', top: hp('28%') }}>
                            <Text style={{ color: '#484848', fontSize: hp('2%') }}>Already have an account? </Text>
                        </View>

                        <View style={{ top: hp('32%') }}>
                            <Button
                                bordered
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    height: hp('6%'),
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 20,
                                    width: wp('60%'),
                                    borderRadius: wp('2%')
                                }}
                                onPress={() => Actions.login()}
                            >
                                <Text style={{ color: '#007CC4', fontSize: hp('2%'), fontWeight: 'bold' }}>Login</Text>
                            </Button>
                        </View>
                    </View>
                </View>
                {/* </KeyboardAvoidingView> */}

                {(this.state.isFetching) ?
                    <ActivityIndicator
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        animating size='large'
                        color='#00ff00'
                    />
                    :
                    null
                }
            </Container>
        );
    }
}

export default Registration;