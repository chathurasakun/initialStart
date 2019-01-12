import React, { Component } from 'react';
import { Alert, AsyncStorage, Text, View, ActionSheetIOS } from 'react-native';
import { Container, Card, CardItem, Right, Left, List, ListItem, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import baseUrl from '../config/baseUrl';
import Icons from 'react-native-vector-icons/AntDesign';
import Icons1 from 'react-native-vector-icons/MaterialCommunityIcons'
import DatePicker from 'react-native-datepicker';
import { EventRegister } from 'react-native-event-listeners';
import { connect } from 'react-redux';
import { removeUser } from '../redux/actions/operations';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class CreateNewTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            timesheetDate: new Date(),
            timesheetShift: '',
            approver: [],
            labourList: [],
            equipList: [],
            matList: [],
            expenseList: []
        }
    }

    componentWillMount = () => {
        this.listener1 = EventRegister.addEventListener('myCustomEvent1', (labourList) => {
            this.setState({
                labourList,
            });
        });

        this.listener2 = EventRegister.addEventListener('myCustomEvent2', (equipList) => {
            this.setState({
                equipList,
            });
        });

        this.listener3 = EventRegister.addEventListener('myCustomEvent3', (matList) => {
            this.setState({
                matList,
            });
        });

        this.listener5 = EventRegister.addEventListener('myCustomEvent5', (expenseObj) => {
            let ex = [];
            let expenseDataArray = this.state.expenseList.slice();
            for (let i in expenseObj) {
                ex.push(expenseObj[i]);
            }

            let obj = {
                id: ex[0],
                images: ex[1],
                amount: ex[2],
                description: ex[3]
            }

            expenseDataArray.push(obj);
            this.setState({
                expenseList: expenseDataArray
            });
        });

        this.listener6 = EventRegister.addEventListener('myCustomEvent6', (expenseObj) => {
            let expenseListArray = this.state.expenseList.slice();
            expenseListArray = expenseListArray.filter((existItem) => existItem.id !== expenseObj.id);
            this.setState({
                expenseList: expenseListArray
            });
        });

        this.listener4 = EventRegister.addEventListener('myCustomEvent4', () => {
            if (this.state.timesheetShift !== '' && this.state.approver.length !== 0 && this.state.labourList.length > 0) {
                let array1 = [];
                this.state.labourList.map((item) => {
                    array1.push({
                        hours: item.hours,
                        workerDTO: {
                            id: `${item.id}`
                        },
                        skillDTO: {
                            id: `${item.skillDTO.id}`
                        }
                    });
                });

                let array2 = [];
                this.state.equipList.map((item) => {
                    array2.push({
                        hours: item.hours,
                        equipmentDTO: {
                            id: `${item.id}`
                        }
                    });
                });

                let array3 = [];
                this.state.matList.map((item) => {
                    array3.push({
                        quantity: item.quantity + item.halfValue,
                        materialDTO: {
                            id: `${item.id}`
                        }
                    });
                });

                let array4 = [];
                this.state.expenseList.map((item) => {
                    let imageArray = item.images;
                    let imageData = [];
                    for (let i in imageArray) {
                        imageData.push(
                            {
                                image: imageArray[i].data
                            }
                        );
                    }
                    array4.push({
                        description: item.description,
                        amount: item.amount,
                        unit: 'CAD',
                        expensesImageDTOs: imageData
                    });
                });

                const data = {
                    purchaseOrderDTO: {
                        id: `${this.props.value.id}`
                    },
                    timesheetDate: `${new Date(`${this.state.timesheetDate}`).getTime()}`,
                    timesheetShift: this.state.timesheetShift,
                    approverDTO: {
                        id: `${this.state.approver.id}`
                    },
                    timeSheetWorkerDTOs: array1,
                    timeSheetEquipmentDTOs: array2,
                    timeSheetMaterialDTOs: array3,
                    timeSheetExpensesDTOs: array4
                }

                this.creatNewTimesheet(data);
            }
            else {
                Alert.alert(
                    '',
                    'Please select the Shift, an Approver and at least one Labor record to submit the Timesheet!',
                    [{ text: 'OK', onPress: () => { } }],
                    { cancelable: false }
                );
            }
        });
    }

    componentWillUnmount = () => {
        EventRegister.removeEventListener(this.listener1);
        EventRegister.removeEventListener(this.listener2);
        EventRegister.removeEventListener(this.listener3);
        EventRegister.removeEventListener(this.listener4);
        EventRegister.removeEventListener(this.listener5);
        EventRegister.removeEventListener(this.listener6);
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

    creatNewTimesheet = (timesheetData) => {
        EventRegister.emit('myCustomEvent10', true);

        AsyncStorage.getItem('key').then((token) => {
            fetch(`${baseUrl.url}timesheet`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': token,
                },
                body: JSON.stringify(timesheetData)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.resultStatus === 'SUCCESSFUL') {
                        EventRegister.emit('reloadDashboard', 'reloadData');
                        EventRegister.emit('myCustomEvent10', false);

                        Alert.alert(
                            'Successful!',
                            'New Timesheet added successfully!',
                            [{ text: 'OK', onPress: () => { Actions.dashboard() } }],
                            { cancelable: false }
                        );
                    }
                    else {
                        if (responseJson.httpStatus === 'UNAUTHORIZED') {
                            EventRegister.emit('myCustomEvent10', false);

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
                            );
                        }
                        else {
                            EventRegister.emit('myCustomEvent10', false);

                            Alert.alert(
                                'Failed',
                                'Create timesheet unsuccessful!',
                                [{ text: 'OK', onPress: () => { } }],
                                { cancelable: false }
                            );
                        }
                    }
                })
        });
    }

    render = () => {
        let shiftType = ['Day Shift', 'Night Shift', 'Cancel'];

        return (
            <Container>
                {(this.props.fromTabBar) ?
                    <Card>
                        <CardItem header>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: hp('2%'),
                                            textAlign: 'left'
                                        }}
                                    >
                                        {this.props.value.description}
                                    </Text>
                                    <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.props.value.poNumber}</Text>
                                </View>
                            </View>
                        </CardItem>
                        <CardItem>
                            <View style={{ flexDirection: 'column' }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: hp('2%'),
                                        textAlign: 'left'
                                    }}
                                >
                                    Agreement
                            </Text>
                                <Text style={{ color: '#9B9B9B', textAlign: 'left', fontSize: hp('2%') }}>{this.props.value.agreementDTO.agreementNumber}</Text>
                            </View>
                        </CardItem>
                        <CardItem footer>
                            <View style={{ flexDirection: 'row' }}>
                                <Left>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: hp('2%'),
                                                textAlign: 'left'
                                            }}
                                        >
                                            Work Order
                                    </Text>
                                        {(this.props.value.costObjectType === 'XOM') ?
                                            <Text style={{ color: '#9B9B9B', textAlign: 'left', fontSize: hp('2%') }}>{this.props.value.costObjectNumber}</Text>
                                            :
                                            <Item regular style={{ width: wp('22%'), height: hp('4%') }}>
                                                <Input
                                                    onChangeText={(workOrderNo) => this.setState({
                                                        workOrderNo: workOrderNo
                                                    })}
                                                    maxLength={8}
                                                    style={{ fontSize: hp('2%'), color: '#9B9B9B' }}
                                                />
                                            </Item>
                                        }
                                    </View>
                                </Left>
                                <Right>
                                    <Text style={{ color: '#7ED321', fontSize: hp('1.5%') }}>{this.props.value.costObjectType}</Text>
                                </Right>
                            </View>
                        </CardItem>
                    </Card>
                    :
                    <Card>
                        <CardItem header>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: hp('2%'),
                                            textAlign: 'left'
                                        }}
                                    >
                                        {this.props.value.description}
                                    </Text>
                                    <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.props.value.poNumber}</Text>
                                </View>
                            </View>
                        </CardItem>
                        <CardItem>
                            <View style={{ flexDirection: 'column' }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: hp('2%'),
                                        textAlign: 'left'
                                    }}
                                >
                                    Agreement
                            </Text>
                                <Text style={{ color: '#9B9B9B', textAlign: 'left', fontSize: hp('2%') }}>{this.props.value.agreementDTO.agreementNumber}</Text>
                            </View>
                        </CardItem>
                        <CardItem footer>
                            <View style={{ flexDirection: 'row' }}>
                                <Left>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: hp('2%'),
                                                textAlign: 'left'
                                            }}
                                        >
                                            Work Order
                                    </Text>
                                        {(this.props.value.costObjectType === 'XOM') ?
                                            <Text style={{ color: '#9B9B9B', textAlign: 'left', fontSize: hp('2%') }}>{this.props.value.costObjectNumber}</Text>
                                            :
                                            <Item regular style={{ width: wp('22%'), height: hp('4%') }}>
                                                <Input
                                                    onChangeText={(workOrderNo) => this.setState({
                                                        workOrderNo: workOrderNo
                                                    })}
                                                    maxLength={8}
                                                    style={{ fontSize: hp('2%'), color: '#9B9B9B' }}
                                                />
                                            </Item>
                                        }
                                    </View>
                                </Left>
                                <Right>
                                    <Text style={{ color: '#7ED321', fontSize: hp('1.5%') }}>{this.props.value.costObjectType}</Text>
                                </Right>
                            </View>
                        </CardItem>
                    </Card>
                }

                <View style={{ backgroundColor: '#ededed', height: hp('1%') }} />

                <List>
                    <ListItem>
                        <Left>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: hp('2%')
                                }}
                            >
                                Timesheet Date
                            </Text>
                        </Left>
                        <Right>
                            <DatePicker
                                style={{ width: 140 }}
                                date={this.state.timesheetDate}
                                mode='date'
                                placeholder='select date'
                                format='YYYY-MM-DD'
                                maxDate={new Date()}
                                confirmBtnText='Confirm'
                                cancelBtnText='Cancel'
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                }}
                                onDateChange={(date) => { this.setState({ timesheetDate: date }) }}
                            />
                        </Right>
                    </ListItem>

                    <View style={{ backgroundColor: '#ededed', height: hp('1%') }} />

                    <ListItem
                        onPress={() => ActionSheetIOS.showActionSheetWithOptions(
                            {
                                options: shiftType,
                                cancelButtonIndex: 2,
                                title: 'Select Shift',
                            },
                            buttonIndex => {
                                if (buttonIndex != 2) {
                                    this.setState({
                                        timesheetShift: shiftType[buttonIndex]
                                    })
                                }
                                else {
                                    this.setState({
                                        timesheetShift: ''
                                    })
                                }
                            }
                        )}
                        style={{ zIndex: -564 }}
                    >
                        <Left>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: hp('2%')
                                }}
                            >
                                Shift
                            </Text>
                        </Left>
                        <Text style={{ fontSize: hp('2%') }}>
                            {this.state.timesheetShift}
                        </Text>
                        <Right>
                            <Icons name='right' style={{ color: '#9B9B9B', fontSize: hp('2%') }} />
                        </Right>
                    </ListItem>

                    <View style={{ backgroundColor: '#ededed', height: hp('1%') }} />

                    <ListItem onPress={() => Actions.push('approveList', { parentComponent: this, poObj: this.props.value })}>
                        <Left>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: hp('2%')
                                }}
                            >
                                Approver
                            </Text>
                        </Left>
                        <Text style={{ fontSize: hp('2%') }}>
                            {this.state.approver.firstName} {this.state.approver.lastName}
                        </Text>
                        <Right>
                            <Icons name='right' style={{ color: '#9B9B9B', fontSize: hp('2%') }} />
                        </Right>
                    </ListItem>

                    <View style={{ backgroundColor: '#ededed', height: hp('1%') }} />

                    <ListItem onPress={() => null}>
                        <Left>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: hp('2%')
                                }}
                            >
                                Import from previous Timesheet
                            </Text>
                        </Left>
                        <Right>
                            <Icons1 name='import' style={{ color: '#9B9B9B', fontSize: hp('4%') }} />
                        </Right>
                    </ListItem>
                </List>
                <View style={{ backgroundColor: '#ededed', height: hp('40%') }} />
            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeUser: () => {
            dispatch(removeUser())
        },
    }
}

export default connect(null, mapDispatchToProps)(CreateNewTimeSheet);