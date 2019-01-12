import React, { Component } from 'react';
import { Image, Text, TextInput, TouchableHighlight, View, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Images from '../utils/images';
import styles from './styles/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Button } from 'native-base';

class ForgetPassword extends Component {

    constructor() {
        super();
        this.state = { emailaddress: null };
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
                            <View style={{ alignItems: 'center', top: hp('30%') }}>
                                <Text style={{ color: '#484848', fontSize: hp('2%') }}>Please enter a registered Email Address to</Text>
                                <Text style={{ color: '#484848', fontSize: hp('2%') }}>receive Password reset instructions</Text>

                                <View style={{ padding: hp('5%') }} />

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.inputs}
                                        editable={true}
                                        placeholder='Email Address'
                                        placeholderTextColor='#BBBDC0'
                                        ref='emailaddress'
                                        keyboardType='email-address'
                                        underlineColorAndroid='transparent'
                                        onChangeText={(emailaddress) => this.setState({ emailaddress })}
                                        value={this.state.emailaddress}
                                    />
                                </View>
                            </View>

                            <View style={{ top: hp('36%') }}>
                                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} >
                                    <Text style={styles.loginText}>Send</Text>
                                </TouchableHighlight>
                            </View>

                            <View style={{ flexDirection: 'row', top: hp('42%') }}>
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
                                    onPress={() => Actions.login()}>
                                    <Text style={{ color: '#007CC4', fontSize: hp('2%'), fontWeight: 'bold' }}>Login</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                {/* </KeyboardAvoidingView> */}
            </Container>
        );
    }
}

export default ForgetPassword;