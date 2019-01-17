import React, { Component } from 'react';
import { Text, ActivityIndicator, View, ScrollView, FlatList, AsyncStorage, Alert, Dimensions } from 'react-native';
import { Header, Button, Container, Card, CardItem, Right, Left, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/AntDesign';
import baseUrl from '../config/baseUrl';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import Dialog, { DialogTitle, DialogContent, SlideAnimation } from 'react-native-popup-dialog';
import t from 'tcomb-form-native';
import { EventRegister } from 'react-native-event-listeners';
import { removeUser } from '../redux/actions/operations';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class ViewTimesheetForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timesheetStatus: this.props.timesheetStatus,
            timesheetId: this.props.timesheetId,
            userType: this.props.userDetails[0].userRoleDTO.name,
            visible: false,
            poNumber: '',
            agreement: '',
            timesheetDate: '',
            timesheetDateToFormat: '',
            shift: '',
            approverName: '',
            labourList: [],
            materialList: [],
            equipList: [],
            expenses: [],
            commentsArray: [],
            pid: '',
            approverList: '',
            isLoading: false
        }
    }

    componentDidMount = () => {
        this.getTimesheetData(this.state.timesheetId);
    }

    convertToYearMonthDate = (time) => {
        let monthName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        let getDate = new Date(time);
        let getYear = getDate.getFullYear().toString();
        let getMonth = getDate.getMonth().toString();
        let getDay = getDate.getDate().toString();
        let yearMonthDate = `${monthName[getMonth]}-${getDay}-${getYear}`;
        return yearMonthDate;
    }

    convertToFormat = (time) => {
        let getDate = new Date(time);
        let getYear = getDate.getFullYear().toString();
        let getMonth = (parseInt(getDate.getMonth().toString()) + 1).toString();
        let getDay = getDate.getDate().toString();
        let yearMonthDate = `${getYear}-${getMonth}-${getDay}`;
        return yearMonthDate;
    }

    setData = (timesheetObj) => {
        this.setState({
            poNumber: timesheetObj.purchaseOrderDTO.poNumber,
            agreement: timesheetObj.purchaseOrderDTO.agreementDTO.agreementNumber,
            workOrder: timesheetObj.purchaseOrderDTO.costObjectNumber,
            timesheetDate: this.convertToYearMonthDate(timesheetObj.timesheetDate),
            shift: timesheetObj.timesheetShift,
            approverName: `${timesheetObj.approverDTO.firstName} ${timesheetObj.approverDTO.lastName}`,
            labourList: this.removeDeletedLabor(timesheetObj.timeSheetWorkerDTOs),
            materialList: this.removeDeletedMaterial(timesheetObj.timeSheetMaterialDTOs),
            equipList: this.removeDeletedEquipment(timesheetObj.timeSheetEquipmentDTOs),
            pid: timesheetObj.purchaseOrderDTO.id,
            approverList: timesheetObj.approverDTO,
            expenses: this.removeDeletedExpense(timesheetObj.timeSheetExpensesDTOs),
            approverStatus: timesheetObj.status,
            commentsArray: timesheetObj.timeSheetCommentsDTOs,
            timesheetDateToFormat: this.convertToFormat(timesheetObj.timesheetDate)
        });
    }

    removeDeletedLabor = (array) => {
        let worker = [];
        for (let i in array) {
            if (array[i].status !== 6) {
                worker.push(array[i]);
            }
        }
        return worker;
    }

    removeDeletedEquipment = (array) => {
        let equipment = [];
        for (let i in array) {
            if (array[i].status !== 6) {
                equipment.push(array[i]);
            }
        }
        return equipment;
    }

    removeDeletedMaterial = (array) => {
        let material = [];
        for (let i in array) {
            if (array[i].status !== 6) {
                material.push(array[i]);
            }
        }
        return material;
    }

    removeDeletedExpense = (array) => {
        let expense = [];
        for (let i in array) {
            if (array[i].status !== 6) {
                expense.push(array[i]);
            }
        }
        return expense;
    }

    renderLabourList = (labourList) => {
        return (
            <CardItem bordered>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 7 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <FastImage
                                style={{
                                    width: hp('8%'),
                                    height: hp('8%'),
                                    borderRadius: hp('8%') / 2
                                }}
                                source={{ uri: labourList.workerDTO.img }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: wp('5%') }}>
                                <View>
                                    <Text style={{ fontSize: hp('2%') }}>{labourList.workerDTO.firstName + " " + labourList.workerDTO.lastName + "    "}</Text>
                                </View>
                                {(labourList.skillDTO !== null) ?
                                    <View>
                                        <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{labourList.skillDTO.skillName}</Text>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: hp('2%') }}>{labourList.hours + " Hrs"}</Text>
                    </View>
                </View>
            </CardItem>
        );
    }

    renderEquipList = (equipList) => {
        return (
            <CardItem bordered>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 7 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: hp('2%') }}>{equipList.equipmentDTO.equipmentName + "   "}</Text>
                            <View style={{ padding: 2 }} />
                            <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{equipList.equipmentDTO.equipmentNumber}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: hp('2%') }}>{equipList.hours + " Hrs"}</Text>
                    </View>
                </View>
            </CardItem>
        );
    }

    renderMaterialList = (materialList) => {
        return (
            <CardItem bordered>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 4 }}>
                        <Text style={{ fontSize: hp('2%') }}>{materialList.materialDTO.materialName + "   "}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: hp('2%') }}>{materialList.quantity + " " + materialList.materialDTO.measurement}</Text>
                    </View>
                </View>
            </CardItem>
        );
    }

    renderExpenseList = (expenseList) => {
        let expenseImageArray = expenseList.expensesImageDTOs;

        return (
            <CardItem bordered>
                <Body>
                    {expenseImageArray.map(item => {
                        return (
                            <View>
                                <FastImage
                                    style={{
                                        width: wp('90%'),
                                        height: hp('25%')
                                    }}
                                    source={{ uri: item.image }}
                                />
                                <View style={{ padding: 2 }} />
                            </View>
                        )
                    })}
                    <View style={{ padding: 1 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <Left>
                            <Text style={{ fontSize: hp('2%') }}>
                                {expenseList.description}
                            </Text>
                        </Left>
                        <Right>
                            <Text style={{ fontSize: hp('2%') }}>{expenseList.unit} {expenseList.amount}</Text>
                        </Right>
                    </View>
                </Body>
            </CardItem>
        );
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

    getTimesheetData = (timesheetId) => {
        this.setState({ isFetchingTimesheetDetails: true }, () => {
            AsyncStorage.getItem('key').then((token) => {
                fetch(`${baseUrl.url}timesheet/${timesheetId}`, {
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
                            this.setState({ isFetchingTimesheetDetails: false }, () => this.setData(responseJson.payload));
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isFetchingTimesheetDetails: false }, () => {
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
                                this.setState({ isFetchingTimesheetDetails: false }, () => {
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
            });
        })
    }

    approveTimesheet = (timesheetId) => {
        this.setState({ isLoading: true }, () => {
            AsyncStorage.getItem('key').then((token) => {
                fetch(`${baseUrl.url}timesheet/approve/${timesheetId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': token,
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.resultStatus === 'SUCCESSFUL') {
                            EventRegister.emit('reloadDashboard', 'reloadData');
                            this.setState({ isLoading: false }, () => {
                                Alert.alert(
                                    '',
                                    'Timesheet approved!',
                                    [
                                        {
                                            text: 'Ok',
                                            onPress: () => Actions.pop(),
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            });
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isLoading: false }, () => {
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
                                this.setState({ isLoading: false }, () => {
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
            });
        })
    }

    rejectTimesheet = (obj, timesheetId) => {
        this.setState({ isLoading: true }, () => {
            AsyncStorage.getItem('key').then((token) => {
                fetch(`${baseUrl.url}timesheet/reject/${timesheetId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': token,
                    },
                    body: JSON.stringify(obj)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.resultStatus === 'SUCCESSFUL') {
                            EventRegister.emit('reloadDashboard', 'reloadData');
                            this.setState({ isLoading: false }, () => {
                                Alert.alert(
                                    '',
                                    'Timesheet rejected!',
                                    [
                                        {
                                            text: 'Ok',
                                            onPress: () => this.setState({ visible: false }, () => Actions.pop()),
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            });
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isLoading: false }, () => {
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
                                this.setState({ isLoading: false }, () => {
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
            });
        })
    }

    getForm = () => {
        return (t.struct({
            Comment: t.String,
        }));
    }

    getFormOptions = () => {
        return ({
            fields: {
                Comment: {
                    multiline: true
                    // error: 'Comment is required',
                },
            },
            auto: 'placeholders'
        });
    }

    handleSubmit = () => {
        const value = this._form.getValue();
        if (value !== null) {
            const Obj = {
                comment: value.Comment
            }
            this.rejectTimesheet(Obj, this.state.timesheetId);
        }
    }

    setColor = (status) => {
        if (status === 4)
            return (color = '#00af5f');
        else if (status === 3)
            return (color = '#f19a10');
        else if (status === 5)
            return (color = '#e85442');
    }

    setType = (status) => {
        if (status === 4)
            return 'APPROVED';
        else if (status === 3)
            return 'PENDING';
        else if (status === 5)
            return 'REJECTED';
    }

    renderComments = (item) => {
        let comment = item.description;
        comment = comment.replace('{comment:', "");
        comment = comment.replace('}', "");
        return (
            <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontWeight: 'bold', color: '#484848', fontSize: hp('2%'), paddingLeft: wp('2%') }}>{comment}</Text>
            </View>
        )
    }

    render = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: '#3a5997', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icons name='left' style={{ fontSize: hp('3%'), color: '#FFFFFF' }} />
                            </Button>
                        </Left>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%'), fontWeight: 'bold' }}>Timesheet</Text>
                        </View>
                        <Right>
                            {(this.state.userType === 'SUPERVISOR' && this.props.timesheetStatus === 5) ?
                                <Button transparent onPress={() => Actions.push('editTimesheetScene', { parentObject: this })}>
                                    <Text style={{ color: '#FFFFFF', fontSize: hp('2%') }}>Edit</Text>
                                </Button>
                                :
                                null
                            }
                        </Right>
                    </View>
                </Header>

                <ScrollView bounces={false}>
                    {(this.state.isFetchingTimesheetDetails === false) ?
                        <View>
                            <Card>
                                <CardItem header bordered>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Left>
                                            <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Summary</Text>
                                        </Left>
                                        {(this.state.userType === 'SUPERVISOR') ?
                                            <Right>
                                                <Text style={{ textAlign: 'center', color: this.setColor(this.props.timesheetStatus), fontWeight: 'bold', fontSize: hp('2.5%') }}>{this.setType(this.props.timesheetStatus)}</Text>
                                            </Right>
                                            :
                                            <Right>
                                                <Text style={{ textAlign: 'center', color: this.setColor(this.state.approverStatus), fontWeight: 'bold', fontSize: hp('2.5%') }}>{this.setType(this.state.approverStatus)}</Text>
                                            </Right>
                                        }
                                    </View>
                                </CardItem>
                                <CardItem bordered>
                                    <Body>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Left>
                                                <Text
                                                    style={{
                                                        fontSize: hp('2%'),
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    PO Number
                                                </Text>
                                            </Left>
                                            <Right>
                                                <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.state.poNumber}</Text>
                                            </Right>
                                        </View>

                                        <View style={{ padding: 5 }} />

                                        <View style={{ flexDirection: 'row' }}>
                                            <Left>
                                                <Text
                                                    style={{
                                                        fontSize: hp('2%'),
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    Agreement
                                                </Text>
                                            </Left>
                                            <Right>
                                                <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.state.agreement}</Text>
                                            </Right>
                                        </View>

                                        <View style={{ padding: 5 }} />

                                        <View style={{ flexDirection: 'row' }}>
                                            <Left>
                                                <Text
                                                    style={{
                                                        fontSize: hp('2%'),
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    Work Order
                                                </Text>
                                            </Left>
                                            <Right>
                                                <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.state.workOrder}</Text>
                                            </Right>
                                        </View>

                                        <View style={{ padding: 5 }} />

                                        <View style={{ flexDirection: 'row' }}>
                                            <Left>
                                                <Text
                                                    style={{
                                                        fontSize: hp('2%'),
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    Timesheet Date
                                                </Text>
                                            </Left>
                                            <Right>
                                                <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.state.timesheetDate}</Text>
                                            </Right>
                                        </View>

                                        <View style={{ padding: 5 }} />

                                        <View style={{ flexDirection: 'row' }}>
                                            <Left>
                                                <Text
                                                    style={{
                                                        fontSize: hp('2%'),
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    Shift
                                                </Text>
                                            </Left>
                                            <Right>
                                                <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.state.shift}</Text>
                                            </Right>
                                        </View>

                                        <View style={{ padding: 5 }} />

                                        <View style={{ flexDirection: 'row' }}>
                                            <Left>
                                                <Text
                                                    style={{
                                                        fontSize: hp('2%'),
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    Approver
                                                </Text>
                                            </Left>
                                            <Right>
                                                <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.state.approverName}</Text>
                                            </Right>
                                        </View>
                                    </Body>
                                </CardItem>
                            </Card>

                            {(this.state.userType === 'SUPERVISOR' && this.props.timesheetStatus === 5) ?
                                <Card>
                                    <CardItem header bordered>
                                        <Text
                                            style={{
                                                fontSize: hp('2.5%'),
                                                textAlign: 'left',
                                                color: '#e85442',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Reason for rejection
                                        </Text>
                                    </CardItem>
                                    <CardItem bordered>
                                        <FlatList
                                            data={this.state.commentsArray}
                                            keyExtractor={(item, index) => item.id}
                                            renderItem={({ item }) => this.renderComments(item)}
                                            scrollEnabled={false}
                                        />
                                    </CardItem>
                                </Card>
                                :
                                null
                            }

                            <Card>
                                <CardItem header bordered>
                                    <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Labour</Text>
                                </CardItem>
                                {(this.state.labourList.length > 0) ?
                                    <FlatList
                                        data={this.state.labourList}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item }) => this.renderLabourList(item)}
                                        scrollEnabled={false}
                                    />
                                    :
                                    <Text style={{ fontSize: hp('2.5%'), color: '#9B9B9B', paddingLeft: wp('3%') }}>Not added.</Text>
                                }
                            </Card>

                            <Card>
                                <CardItem header bordered>
                                    <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Equipment</Text>
                                </CardItem>
                                {(this.state.equipList.length > 0) ?
                                    <FlatList
                                        data={this.state.equipList}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item }) => this.renderEquipList(item)}
                                        scrollEnabled={false}
                                    />
                                    :
                                    <Text style={{ fontSize: hp('2.5%'), color: '#9B9B9B', paddingLeft: wp('3%') }}>Not added.</Text>
                                }
                            </Card>

                            <Card>
                                <CardItem header bordered>
                                    <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Material</Text>
                                </CardItem>
                                {(this.state.materialList.length > 0) ?
                                    <FlatList
                                        data={this.state.materialList}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item }) => this.renderMaterialList(item)}
                                        scrollEnabled={false}
                                    />
                                    :
                                    <Text style={{ fontSize: hp('2.5%'), color: '#9B9B9B', paddingLeft: wp('3%') }}>Not added.</Text>
                                }
                            </Card>

                            <Card>
                                <CardItem header bordered>
                                    <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Expenses</Text>
                                </CardItem>
                                {(this.state.expenses.length > 0) ?
                                    <FlatList
                                        data={this.state.expenses}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item }) => this.renderExpenseList(item)}
                                        scrollEnabled={false}
                                    />
                                    :
                                    <Text style={{ fontSize: hp('2.5%'), color: '#9B9B9B', paddingLeft: wp('3%') }}>Not added.</Text>
                                }
                            </Card>
                        </View>
                        :
                        <View style={{ marginTop: hp('45%') }}>
                            <ActivityIndicator animating size='large' color='#00ff00' />
                        </View>
                    }

                    {(this.state.userType !== 'SUPERVISOR' && this.state.isFetchingTimesheetDetails === false && this.props.status === 3) ?
                        <View style={{ flexDirection: 'row', marginTop: hp('2%'), marginBottom: hp('2%') }}>
                            <Left>
                                <Button
                                    style={{
                                        backgroundColor: '#008b00',
                                        width: wp('40%'),
                                        height: hp('5%'),
                                        borderRadius: wp('5%'),
                                        marginLeft: wp('2%'),
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => this.approveTimesheet(this.state.timesheetId)}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: hp('2%') }}>Approve</Text>
                                </Button>
                            </Left>
                            <Right>
                                <Button
                                    style={{
                                        backgroundColor: '#C62828',
                                        width: wp('40%'),
                                        height: hp('5%'),
                                        borderRadius: wp('5%'),
                                        marginRight: wp('2%'),
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => this.setState({ visible: true })}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: hp('2%') }}>Reject</Text>
                                </Button>
                            </Right>
                        </View>
                        :
                        null
                    }
                </ScrollView>

                <Dialog
                    visible={this.state.visible}
                    dialogStyle={{
                        width: wp('80%'),
                        height: (Dimensions.get('window').height === 568) ? hp('24%') : (Dimensions.get('window').height === 1366) ? hp('20%') : (Dimensions.get('window').height === 1194) ? hp('20%') : (Dimensions.get('window').height === 1112) ? hp('20%') : (Dimensions.get('window').height === 1024) ? hp('20%') : hp('22%')
                    }}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    dialogTitle={
                        <DialogTitle
                            title='Add Comment'
                            style={{ backgroundColor: '#3a5997' }}
                            textStyle={{ color: '#FFFFFF', fontSize: hp('2%') }}
                        />
                    }
                >
                    <DialogContent
                        style={{
                            marginTop: 5,
                            //height: hp('5%')
                        }}
                    >
                        <View style={{ flexDirection: 'column' }}>
                            <t.form.Form
                                ref={c => this._form = c}
                                type={this.getForm()}
                                options={this.getFormOptions()}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Left>
                                    <Button
                                        style={{
                                            backgroundColor: '#007CC4',
                                            width: wp('30%'),
                                            height: hp('5%'),
                                            borderRadius: wp('5%'),
                                            marginRight: wp('2%'),
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => this.handleSubmit()}>
                                        <Text style={{ color: '#FFFFFF', fontSize: hp('2%') }}>Submit</Text>
                                    </Button>
                                </Left>
                                <Right>
                                    <Button
                                        bordered
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            width: wp('30%'),
                                            height: hp('5%'),
                                            borderRadius: wp('5%'),
                                            marginLeft: wp('2%'),
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => this.setState({ visible: false })}>
                                        <Text style={{ color: '#007CC4', fontSize: hp('2%') }}>Cancel</Text>
                                    </Button>
                                </Right>
                            </View>
                        </View>
                    </DialogContent>
                </Dialog>

                {(this.state.isLoading) ?
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

const mapStateToProps = (state) => {
    return {
        userDetails: state.userDetails.userData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeUser: () => {
            dispatch(removeUser())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewTimesheetForm);