import React, { Component } from 'react';
import { Alert, AsyncStorage, Image, Text, TextInput, TouchableHighlight, View, ActivityIndicator, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Images from '../utils/images';
import styles from './styles/Style';
import deviceStorage from './deviceStorage';
import baseUrl from '../config/baseUrl';
import { updateUser } from '../redux/actions/operations';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Button } from 'native-base';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            isFetching: false,
            emailError: '',
            passError: '',
            isFetchingUser: false
        };
    }

    validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            this.setState({
                username: text,
                emailError: 'Please enter a valid Email address'
            });
            return false;
        }
        else {
            this.setState({
                username: text,
                emailError: ''
            });
        }
    }

    passwordIsEmpty = (text) => {
        if (text === '') {
            this.setState({
                passError: 'Please enter a password',
                password: text
            });
        }
        else {
            this.setState({
                passError: '',
                password: text
            });
        }
    }

    LoginToDashboard = () => {
        if (this.state.username !== '' && this.state.password !== '' && this.state.passError === '' && this.state.emailError === '') {
            const data = {
                email: this.state.username,
                password: this.state.password
            }
            this.setState({ isFetching: true }, () => {
                fetch(`${baseUrl.url}auth`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.payload !== null) {
                            if (responseJson.payload.status === 'Y') {
                                deviceStorage.saveItem('key', responseJson.payload.accessToken);
                                this.setState({
                                    username: '',
                                    password: '',
                                    isFetching: false
                                }, () => this.getUserDetails());
                            }
                        }
                        else {
                            this.setState({ isFetching: false }, () => {
                                Alert.alert(
                                    'Login Unsuccessful!',
                                    'Incorrect Username and/or Password!',
                                    [
                                        {
                                            text: 'Ok',
                                            onPress: console.log('ok pressesd'),
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            });
                        }
                    })
            });
        }
        else {
            if (this.state.password === '') {
                this.setState({
                    passError: 'Please enter a password'
                });
            }
            if (this.state.username === '') {
                this.setState({
                    emailError: 'Please enter a valid Email address'
                });
            }
        }
    }

    getUserDetails = () => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingUser: true }, () => {
                fetch(`${baseUrl.url}user`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': token,
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.resultStatus === 'SUCCESSFUL') {
                            this.props.updateUser(responseJson.payload);
                            deviceStorage.saveItem('userObj', JSON.stringify(responseJson.payload));
                            this.setState({ isFetchingUser: false }, () => Actions.dashboard());
                        }
                        else
                            this.setState({ isFetchingUser: false });
                    })
            });
        });
    }

    render = () => {
        return (
            <Container>
                {/* <KeyboardAvoidingView behavior='position'> */}
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
                                placeholder='Username'
                                placeholderTextColor='#BBBDC0'
                                ref='username'
                                keyboardType='email-address'
                                underlineColorAndroid='transparent'
                                onChangeText={(username) => this.validateEmail(username)}
                                value={this.state.username}
                            />
                        </View>
                        <Text style={{ color: '#FF2F2F', fontSize: hp('1.9%') }}>{this.state.emailError}</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputs}
                                editable={true}
                                placeholder='Password?'
                                placeholderTextColor='#BBBDC0'
                                ref='password'
                                returnKeyType='next'
                                secureTextEntry={true}
                                underlineColorAndroid='transparent'
                                onChangeText={(password) => this.passwordIsEmpty(password)}
                                value={this.state.password}
                            />
                        </View>
                        <Text style={{ color: '#FF2F2F', fontSize: hp('1.9%') }}>{this.state.passError}</Text>
                    </View>

                    <View style={{ top: hp('28%') }}>
                        <TouchableHighlight style={{ alignItems: 'center' }} onPress={() => Actions.resendEmail()}>
                            <Text style={{ color: '#007CC4', fontSize: hp('2%') }}>Forgot your Password?</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={{ top: hp('32%') }}>
                        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.LoginToDashboard()}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={{ flexDirection: 'row', top: hp('38%') }}>
                        <Text style={{ color: '#484848', fontSize: hp('2%') }}>Don't have an account? </Text>
                    </View>

                    <View style={{ top: hp('45%') }}>
                        <Button bordered style={[styles.buttonContainer, styles.registerButton]} onPress={() => Actions.registration()}>
                            <Text style={styles.registerText}>Register</Text>
                        </Button>
                    </View>
                </View>
                {/* </KeyboardAvoidingView> */}

                {(this.state.isFetching || this.state.isFetchingUser) ?
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

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (user) => {
            dispatch(updateUser(user))
        },
    }
}

export default connect(null, mapDispatchToProps)(Login);

