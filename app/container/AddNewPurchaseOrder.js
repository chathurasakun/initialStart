import React, { Component } from 'react';
import { Text, View, ScrollView, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { Header, Button, Container, Left, Right } from 'native-base';
import Icons from 'react-native-vector-icons/AntDesign';
import baseUrl from '../config/baseUrl';
import { Actions } from 'react-native-router-flux';
import { removeUser } from '../redux/actions/operations';
import { connect } from 'react-redux';
import t from 'tcomb-form-native';
import { EventRegister } from 'react-native-event-listeners';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class AddNewPurchaseOrder extends Component {

    constructor() {
        super();
        this.state = {
            pickerOptions: t.enums({}),
            agreementArray: [],
            agreementDict: {}
        }
    }

    componentDidMount = () => {
        this.getAgreementList();

        this.setState({
            pickerOptions: t.enums(this.state.agreementDict)
        });
    }

    setToDictionaryFormat = () => {
        let array = this.state.agreementArray;
        let dict = this.state.agreementDict;
        for (let i in array) {
            dict[array[i].id] = array[i].agreementNumber;
        }
        console.log(dict);
        this.setState({
            agreementDict: dict
        });
    }

    async sessionExpired() {
        try {
            await AsyncStorage.removeItem('key');
            await AsyncStorage.removeItem('userObj');
            this.props.removeUser();
            Actions.login();
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    getAgreementList = () => {
        AsyncStorage.getItem('key').then((token) => {
            fetch(`${baseUrl.url}agreement/list`, {
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
                        this.setState({
                            agreementArray: responseJson.payload
                        }, () => { this.setToDictionaryFormat() });
                    }
                    else {
                        if (responseJson.httpStatus === 'UNAUTHORIZED') {
                            Alert.alert(
                                'Session expired!',
                                `${responseJson.message.message}.Redirecting to login screen`,
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => { this.sessionExpired() },
                                    },
                                ],
                                { cancelable: false }
                            )
                        }
                        else {
                            Alert.alert(
                                '',
                                `${responseJson.message.message}`,
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => { },
                                    },
                                ],
                                { cancelable: false }
                            )
                        }
                    }
                })
        })
    }

    addNewPurchaseOrder = (data) => {
        this.setState({ isCompleting: true }, () => {
            AsyncStorage.getItem('key').then((token) => {
                this.setState({ isSaving: true }, () => {
                    fetch(`${baseUrl.url}purchaseorder`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'token': token,
                        },
                        body: JSON.stringify(data)
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.resultStatus === 'SUCCESSFUL') {
                                this.setState({
                                    isCompleting: false
                                }, () => {
                                    Alert.alert(
                                        'Successful!',
                                        'New Purchase Order Added',
                                        [
                                            {
                                                text: 'Ok',
                                                onPress: () => Actions.pop(),
                                            },
                                        ],
                                        { cancelable: false }
                                    )
                                });
                                EventRegister.emit('reloadPoPage', 'refreshData');
                            }
                            else {
                                if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                    this.setState({ isCompleting: false }, () => {
                                        Alert.alert(
                                            'Session expired!',
                                            `${responseJson.message.message}.Redirecting to login screen`,
                                            [
                                                {
                                                    text: 'Ok',
                                                    onPress: () => { this.sessionExpired() },
                                                },
                                            ],
                                            { cancelable: false }
                                        )
                                    });
                                }
                                else {
                                    this.setState({ isCompleting: false }, () => {
                                        Alert.alert(
                                            '',
                                            `${responseJson.message.message}`,
                                            [
                                                {
                                                    text: 'Ok',
                                                    onPress: () => { },
                                                },
                                            ],
                                            { cancelable: false }
                                        )
                                    });
                                }
                            }
                        })
                })
            })
        });
    }

    handleSubmit = () => {
        const value = this._form.getValue();
        if (value !== null) {
            if (value.workOrder !== null) {
                const newPurchaseOrderObj = {
                    agreementDTO: {
                        id: value.selectAnAgreement
                    },
                    poNumber: value.purchaseOrderNumber,
                    description: value.description,
                    costObjectType: 'XOM',
                    costObjectNumber: value.workOrder
                }
                this.addNewPurchaseOrder(newPurchaseOrderObj);
            }
            else {
                const newPurchaseOrderObj = {
                    agreementDTO: {
                        id: value.selectAnAgreement
                    },
                    poNumber: value.purchaseOrderNumber,
                    description: value.description,
                    costObjectType: 'XOM-U',
                    costObjectNumber: value.workOrder
                }
                this.addNewPurchaseOrder(newPurchaseOrderObj);
            }
        }
    }

    getForm = () => {
        return (t.struct({
            selectAnAgreement: this.state.pickerOptions,
            purchaseOrderNumber: t.String,
            description: t.String,
            workOrder: t.maybe(t.String),
        }));
    }

    getFormOptions = () => {
        return ({
            fields: {
                selectAnAgreement: {
                    auto: 'labels'
                    //error: 'Select an Agreement'
                },
                purchaseOrderNumber: {
                    //auto: 'labels',
                    //placeholders: 'Purchase order number',
                    //error: 'Enter valid Purchase Order'
                },
                description: {
                    //auto: 'labels',
                    multiline: true,
                    //error: 'Description is required'
                },
                workOrder: {
                    //auto: 'labels'
                }
            },
            auto: 'placeholders'
        });
    }

    render = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: '#007CC4', height: hp('10%') }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icons name='left' style={{ color: '#FFFFFF', fontSize: hp('2%') }} />
                            </Button>
                        </Left>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%'), fontWeight: 'bold' }}>New Purchase Order</Text>
                        </View>
                        <Right />
                    </View>
                </Header>

                <ScrollView>
                    <View
                        style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 15
                        }}
                    >
                        <t.form.Form
                            ref={c => this._form = c}
                            type={this.getForm()}
                            options={this.getFormOptions()}
                        />
                    </View>

                    <View style={{ alignItems: 'flex-end', flexDirection: 'row', marginTop: hp('2%') }}>
                        <Left>
                            <Button
                                style={{
                                    backgroundColor: '#007CC5',
                                    width: wp('40%'),
                                    height: hp('6%'),
                                    borderRadius: wp('2%'),
                                    marginLeft: wp('3%'),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => this.handleSubmit()}
                            >
                                <Text style={{ color: '#FFFFFF', fontSize: hp('2%'), fontWeight: 'bold' }}>Add</Text>
                            </Button>
                        </Left>
                        <Right>
                            <Button
                                bordered
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    width: wp('40%'),
                                    height: hp('6%'),
                                    borderRadius: wp('2%'),
                                    marginRight: wp('3%'),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => Actions.pop()}
                            >
                                <Text style={{ color: '#007CC4', fontSize: hp('2%'), fontWeight: 'bold' }}>Cancel</Text>
                            </Button>
                        </Right>
                    </View>
                </ScrollView>

                {(this.state.isCompleting) ?
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
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeUser: () => {
            dispatch(removeUser())
        },
    }
}

export default connect(null, mapDispatchToProps)(AddNewPurchaseOrder);

