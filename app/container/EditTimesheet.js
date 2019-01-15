import React, { Component } from 'react';
import { Text, ActivityIndicator, View, ScrollView, FlatList, AsyncStorage, Alert, TouchableOpacity, ActionSheetIOS } from 'react-native';
import { Header, Button, Container, Card, CardItem, Right, Left, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/AntDesign';
import Metrics from '../utils/matrics';
import baseUrl from '../config/baseUrl';
import FastImage from 'react-native-fast-image';
import DatePicker from 'react-native-datepicker';
import { connect } from 'react-redux';
import { removeUser } from '../redux/actions/operations';
import { EventRegister } from 'react-native-event-listeners';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class EditTimesheet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            poNumber: this.props.parentObject.state.poNumber,
            agreement: this.props.parentObject.state.poNumber,
            workorder: this.props.parentObject.state.workOrder,
            timesheetdate: this.props.parentObject.state.timesheetDateToFormat,
            shiftCategory: this.props.parentObject.state.shift,
            laborArray: this.getLaborArray(this.props.parentObject.state.labourList),
            equipmentArray: this.getEquipmentArray(this.props.parentObject.state.equipList),
            materialArray: this.getMaterialArray(this.props.parentObject.state.materialList),
            expenseArray: this.props.parentObject.state.expenses,
            purchase_Order_id: this.props.parentObject.state.pid,
            approverArray: this.props.parentObject.state.approverList,
            fromServerLabor: this.props.parentObject.state.labourList,
            fromServerMaterial: this.props.parentObject.state.materialList,
            fromServerEquip: this.props.parentObject.state.equipList,
            fromServerExpense: this.props.parentObject.state.expenses,
            equipIds: this.getEquipIds(this.props.parentObject.state.equipList),
            materialIds: this.getMaterialIds(this.props.parentObject.state.materialList),
            laborIds: this.getLaborIds(this.props.parentObject.state.labourList),
            expenseIds: this.props.parentObject.state.expenses
        }
    }

    componentWillMount = () => {
        this.listener20 = EventRegister.addEventListener('myCustomEvent20', (expenseItem) => {
            let expenseArrayList = this.state.expenseArray.slice();
            let count = 0;
            for (let j in expenseArrayList) {
                if (expenseArrayList[j].id === expenseItem.id) {
                    expenseArrayList = expenseArrayList.filter((existItem) => existItem !== expenseArrayList[j]);
                    expenseArrayList.push(expenseItem);
                }
                else {
                    count++;
                }
            }
            if (count === expenseArrayList.length) {
                expenseArrayList.push(expenseItem);
            }

            //setting data to fromServerExpense array
            let fromServerExpenseDataArray = this.state.fromServerExpense.slice();
            fromServerExpenseDataArray = fromServerExpenseDataArray.filter((existItem) => existItem.id !== expenseItem.id);
            fromServerExpenseDataArray.push(expenseItem);

            this.setState({
                expenseArray: expenseArrayList,
                fromServerExpense: fromServerExpenseDataArray
            });
        });
    }

    componentWillUnmount = () => {
        EventRegister.removeEventListener(this.listener20);
    }

    getEquipIds = (array) => {
        let equipids = [];
        for (let i in array) {
            let obj = {
                id: array[i].equipmentDTO.id,
                hours: array[i].hours
            }
            equipids.push(obj);
        }
        return equipids;
    }

    getMaterialIds = (array) => {
        let materialids = [];
        for (let i in array) {
            let obj = {
                quantity: array[i].quantity,
                id: array[i].materialDTO.id
            }
            materialids.push(obj);
        }
        return materialids;
    }

    getLaborIds = (array) => {
        let laborids = [];
        for (let i in array) {
            let obj = {
                hours: array[i].hours,
                id: array[i].workerDTO.id,
                skillId: array[i].skillDTO.id,
                skill: array[i].skillDTO.skillName
            }
            laborids.push(obj);
        }
        return laborids;
    }

    getLaborArray = (lArray) => {
        let laborData = [];
        for (let i in lArray) {
            let obj = {
                id: lArray[i].workerDTO.id,
                hours: lArray[i].hours,
                firstName: lArray[i].workerDTO.firstName,
                lastName: lArray[i].workerDTO.lastName,
                img: lArray[i].workerDTO.img,
                skill: lArray[i].skillDTO.skillName,
                skillDTO: {
                    id: lArray[i].skillDTO.id,
                    skillName: lArray[i].skillDTO.skillName
                },
                status: lArray[i].status
            }
            laborData.push(obj);
        }
        return laborData;
    }

    getEquipmentArray = (eArray) => {
        let equipData = [];
        for (let i in eArray) {
            let obj = {
                id: eArray[i].equipmentDTO.id,
                equipmentName: eArray[i].equipmentDTO.equipmentName,
                equipmentNumber: eArray[i].equipmentDTO.equipmentNumber,
                created: eArray[i].created,
                updated: eArray[i].updated,
                hours: eArray[i].hours,
                status: eArray[i].status
            }
            equipData.push(obj);
        }
        return equipData;
    }

    getMaterialArray = (matArray) => {
        let matData = [];
        for (let i in matArray) {
            let obj = {
                id: matArray[i].materialDTO.id,
                materialName: matArray[i].materialDTO.materialName,
                measurement: matArray[i].materialDTO.measurement,
                quantity: matArray[i].quantity,
                halfValue: '0.0',
                created: matArray[i].created,
                updated: matArray[i].updated,
                status: matArray[i].status
            }
            matData.push(obj);
        }
        return matData;
    }

    setSkillAndSkillId = () => {
        let fromServerLaborArray = this.state.fromServerLabor.slice();
        let laborArray = this.state.laborArray;

        for (let i in laborArray) {
            for (let j in fromServerLaborArray) {
                if (fromServerLaborArray[j].workerDTO.id === laborArray[i].id && fromServerLaborArray[j].skillDTO.id !== laborArray[i].skillDTO.id) {
                    fromServerLaborArray[j].skillDTO.id = laborArray[i].skillDTO.id;
                    fromServerLaborArray[j].skillDTO.skillName = laborArray[i].skillDTO.skillName;
                    if (fromServerLaborArray[j].status !== '7')
                        fromServerLaborArray[j].status = '2';
                }
            }
        }

        this.setState({
            fromServerLabor: fromServerLaborArray
        });
    }

    updateTimesheet = () => {
        if (this.state.shiftCategory !== '' && this.state.approverArray.length !== 0 && this.state.laborArray.length > 0) {
            //console.log(this.state.fromServerMaterial);
            //console.log(this.state.fromServerEquip);
            this.setSkillAndSkillId();
            console.log('--------------------###$%%%^^^');
            //console.log(this.state.fromServerLabor);
            console.log(this.state.fromServerExpense);

            let timeSheetWorkerDTOs = [];
            let timeSheetEquipmentDTOs = [];
            let timeSheetMaterialDTOs = [];
            let timeSheetExpensesDTOs = [];

            let lArray = this.state.fromServerLabor;
            for (let i in lArray) {
                let laborObj = {
                    id: (lArray[i].id !== undefined) ? lArray[i].id : null,
                    status: lArray[i].status,
                    hours: lArray[i].hours,
                    workerDTO: {
                        id: lArray[i].workerDTO.id
                    },
                    skillDTO: {
                        id: lArray[i].skillDTO.id
                    }
                }
                timeSheetWorkerDTOs.push(laborObj);
            }
            //console.log(timeSheetWorkerDTOs);

            let eArray = this.state.fromServerEquip;
            for (let i in eArray) {
                let equipObj = {
                    id: (eArray[i].id !== undefined) ? eArray[i].id : null,
                    status: eArray[i].status,
                    hours: eArray[i].hours,
                    equipmentDTO: {
                        id: eArray[i].equipmentDTO.id
                    }
                }
                timeSheetEquipmentDTOs.push(equipObj);
            }
            //console.log(timeSheetEquipmentDTOs);

            let mArray = this.state.fromServerMaterial;
            for (let i in mArray) {
                let materialObj = {
                    id: (mArray[i].id !== undefined) ? mArray[i].id : null,
                    status: mArray[i].status,
                    quantity: mArray[i].quantity,
                    materialDTO: {
                        id: mArray[i].materialDTO.id
                    }
                }
                timeSheetMaterialDTOs.push(materialObj);
            }
            //console.log(timeSheetMaterialDTOs);

            let exArray = this.state.fromServerExpense;
            for (let i in exArray) {
                if (exArray[i].id > 0 && exArray[i].id < 1) {
                    if (exArray[i].status !== '6') {
                        let imageArray = exArray[i].expensesImageDTOs;
                        let imageDTOs = [];
                        for (let j in imageArray) {
                            let imageObj = {
                                id: null,
                                status: imageArray[j].status,
                                image: imageArray[j].imageData
                            }
                            imageDTOs.push(imageObj);
                        }

                        let expenseObj = {
                            id: null,
                            status: '7',
                            description: exArray[i].description,
                            amount: exArray[i].amount,
                            unit: 'CAD',
                            expensesImageDTOs: imageDTOs
                        }
                        timeSheetExpensesDTOs.push(expenseObj);
                    }
                }
                else {
                    let imageArray = exArray[i].expensesImageDTOs;
                    let imageDTOs = [];
                    for (let j in imageArray) {
                        let imageObj = {
                            id: imageArray[j].id,
                            status: imageArray[j].status,
                            image: imageArray[j].imageData
                        }
                        imageDTOs.push(imageObj);
                    }

                    let expenseObj = {
                        id: exArray[i].id,
                        status: exArray[i].status,
                        description: exArray[i].description,
                        amount: exArray[i].amount,
                        unit: 'CAD',
                        expensesImageDTOs: imageDTOs
                    }
                    timeSheetExpensesDTOs.push(expenseObj);
                }
            }
            //console.log(timeSheetExpensesDTOs);

            const data = {
                timesheetDate: `${new Date(`${this.state.timesheetdate}`).getTime()}`,
                timesheetShift: this.state.shiftCategory,
                status: '2',
                id: this.props.parentObject.state.timesheetId,
                timeSheetWorkerDTOs: timeSheetWorkerDTOs,
                timeSheetEquipmentDTOs: timeSheetEquipmentDTOs,
                timeSheetMaterialDTOs: timeSheetMaterialDTOs,
                timeSheetExpensesDTOs: timeSheetExpensesDTOs,
                approverDTO: {
                    id: this.state.approverArray.id
                },
                purchaseOrderDTO: {
                    id: this.props.parentObject.state.pid,
                    status: '1'
                }
            }
            this.updateTimesheetServer(data);
        }
        else {
            Alert.alert(
                '',
                'Please select the Shift, an Approver and at least one Labor record to submit the Timesheet!',
                [{ text: 'OK', onPress: () => { } }],
                { cancelable: false }
            );
        }
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

    updateTimesheetServer = (timesheetData) => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isUpdating: true }, () => {
                fetch(`${baseUrl.url}timesheet/${this.props.parentObject.state.timesheetId}`, {
                    method: 'PUT',
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
                            this.setState({
                                isUpdating: false
                            }, () => {
                                Alert.alert(
                                    'Successful!',
                                    'New Timesheet updated successfully!',
                                    [{ text: 'OK', onPress: () => { Actions.dashboard() } }],
                                    { cancelable: false }
                                );
                            });
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({
                                    isUpdating: false
                                }, () => {
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
                                this.setState({
                                    isUpdating: false
                                }, () => {
                                    Alert.alert(
                                        'Failed',
                                        'Update timesheet unsuccessful!',
                                        [{ text: 'OK', onPress: () => { } }],
                                        { cancelable: false }
                                    )
                                });
                            }
                        }
                    })
            });
        });
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
                                source={{ uri: labourList.img }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: wp('5%') }}>
                                <View>
                                    <Text style={{ fontSize: hp('2%') }}>{labourList.firstName + ' ' + labourList.lastName + '    '}</Text>
                                </View>
                                {(labourList.skillDTO !== null) ?
                                    <View>
                                        <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{labourList.skill}</Text>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: hp('2%') }}>{labourList.hours + ' Hrs'}</Text>
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
                            <Text style={{ fontSize: hp('2%') }}>{equipList.equipmentName + '   '}</Text>
                            <View style={{ padding: 2 }} />
                            <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{equipList.equipmentNumber}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: hp('2%') }}>{equipList.hours + ' Hrs'}</Text>
                    </View>
                </View>
            </CardItem>
        );
    }

    renderMaterialList = (materialList) => {
        let amount = parseInt(materialList.quantity) + parseInt(materialList.halfValue);

        return (
            <CardItem bordered>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 4 }}>
                        <Text style={{ fontSize: hp('2%') }}>{materialList.materialName + "   "}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: hp('2%') }}>{amount} {materialList.measurement}</Text>
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
                                        width: this.getUploadImageSreenWidthHeight().width,
                                        height: this.getUploadImageSreenWidthHeight().height
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

    getUploadImageSreenWidthHeight = () => {
        const screenWidth = Metrics.screenWidth;
        const imageWidth = (screenWidth) - 32;
        const imageHeight = (screenWidth) - 96;
        return { width: imageWidth, height: imageHeight };
    }

    setColor = (status) => {
        if (status === 4)
            return (color = '#008B02');
        else if (status === 3)
            return (color = '#F5A623');
        else if (status == 5)
            return (color = '#C6283A');
    }

    setType = (status) => {
        if (status === 4)
            return 'Approved';
        else if (status === 3)
            return 'Pending';
        else if (status === 5)
            return 'Rejected';
    }

    renderComments = (item) => {
        return (<Text style={{ fontWeight: 'bold', color: '#9B9B9B' }}>{item.description}</Text>)
    }

    render = () => {
        let shiftType = ['Day Shift', 'Night Shift', 'Cancel'];

        return (
            <Container>
                <Header style={{ backgroundColor: '#007CC4', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button
                                transparent
                                onPress={() => {
                                    Alert.alert(
                                        '',
                                        'Are you sure you want to discard changes?',
                                        [{
                                            text: 'Yes', onPress: () => { Actions.dashboard() }
                                        },
                                        {
                                            text: 'No', onPress: () => { }
                                        }],
                                    );
                                }}
                            >
                                <Icons name='left' style={{ fontSize: hp('2%'), color: '#FFFFFF' }} />
                            </Button>
                        </Left>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%'), fontWeight: 'bold' }}>Edit Timesheet</Text>
                        </View>
                        <Right >
                            <Button transparent onPress={() => this.updateTimesheet()}>
                                <Text style={{ color: '#FFFFFF', fontSize: hp('2%') }}>Update</Text>
                            </Button>
                        </Right>
                    </View>
                </Header>

                <ScrollView>
                    <View>
                        <Card>
                            <CardItem header bordered>
                                <View style={{ flexDirection: 'row' }}>
                                    <Left>
                                        <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Summary</Text>
                                    </Left>
                                    <Right>
                                        <Text style={{ textAlign: 'center', color: this.setColor(this.props.parentObject.state.timesheetStatus), fontWeight: 'bold', fontSize: hp('2.5%') }}>{this.setType(this.props.parentObject.state.timesheetStatus)}</Text>
                                    </Right>
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
                                            <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.state.workorder}</Text>
                                        </Right>
                                    </View>
                                </Body>
                            </CardItem>

                            <CardItem bordered>
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
                                        <DatePicker
                                            style={{ width: 140 }}
                                            date={this.state.timesheetdate}
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
                                            onDateChange={(date) => { this.setState({ timesheetdate: date }) }}
                                        />
                                    </Right>
                                </View>
                            </CardItem>

                            <CardItem
                                bordered
                                style={{ height: hp('6%') }}
                            >
                                <TouchableOpacity
                                    onPress={() => ActionSheetIOS.showActionSheetWithOptions(
                                        {
                                            options: shiftType,
                                            cancelButtonIndex: 2,
                                            title: 'Select Shift',
                                        },
                                        buttonIndex => {
                                            if (buttonIndex != 2) {
                                                this.setState({
                                                    shiftCategory: shiftType[buttonIndex]
                                                })
                                            }
                                            else {
                                                this.setState({
                                                    shiftCategory: ''
                                                })
                                            }
                                        }
                                    )}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                fontSize: hp('2%'),
                                                textAlign: 'left',
                                                width: '10%'
                                            }}
                                        >
                                            Shift
                                        </Text>
                                        <Text style={{ color: '#9B9B9B', width: '90%', textAlign: 'right', fontSize: hp('2%') }}>{this.state.shiftCategory}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardItem>

                            <CardItem
                                bordered
                                style={{ height: hp('6%') }}
                            >
                                <TouchableOpacity onPress={() => Actions.push('approveList', { parentComponent: this, fromEditTimesheet: true })}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                fontSize: hp('2%'),
                                                textAlign: 'left',
                                                width: '20%'
                                            }}
                                        >
                                            Approver
                                        </Text>
                                        <Text style={{ color: '#9B9B9B', width: '80%', textAlign: 'right', fontSize: hp('2%') }}>{this.state.approverArray.firstName} {this.state.approverArray.lastName}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardItem>

                            <CardItem bordered>
                                <View style={{ flexDirection: 'row' }}>
                                    <Left>
                                        <Text
                                            style={{
                                                fontSize: hp('2%'),
                                                textAlign: 'left',
                                                color: '#C6283A'
                                            }}
                                        >
                                            Reason for rejection
                                        </Text>
                                    </Left>
                                    <Right>
                                        <FlatList
                                            data={this.props.parentObject.state.commentsArray}
                                            keyExtractor={(item, index) => item.id}
                                            renderItem={({ item }) => this.renderComments(item)}
                                            scrollEnabled={false}
                                        />
                                    </Right>
                                </View>
                            </CardItem>
                        </Card>

                        <Card>
                            <CardItem header bordered>
                                <View style={{ flexDirection: 'row' }}>
                                    <Left>
                                        <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Labour</Text>
                                    </Left>
                                    <Right>
                                        <Button
                                            onPress={() => Actions.push('labourList', { parentComponent: this, fromEditTimesheet: true })}
                                            style={{
                                                height: hp('4.5%'),
                                                backgroundColor: '#C62828',
                                                width: wp('11%'),
                                                borderRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Edit</Text>
                                        </Button>
                                    </Right>
                                </View>
                            </CardItem>
                            {(this.state.laborArray.length > 0) ?
                                <FlatList
                                    data={this.state.laborArray}
                                    keyExtractor={(item, index) => item.id}
                                    renderItem={({ item }) => (item.status !== 6) ? this.renderLabourList(item) : null}
                                    extraData={this.state}
                                />
                                :
                                <Text style={{ fontSize: hp('2.5%'), color: '#9B9B9B', paddingLeft: wp('3%') }}>No Labors to display</Text>
                            }
                        </Card>

                        <Card>
                            <CardItem header bordered>
                                <View style={{ flexDirection: 'row' }}>
                                    <Left>
                                        <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Equipment</Text>
                                    </Left>
                                    <Right>
                                        <Button
                                            onPress={() => Actions.push('equipmentList', { parentComponent: this, fromEditTimesheet: true })}
                                            style={{
                                                height: hp('4.5%'),
                                                backgroundColor: '#C62828',
                                                width: wp('11%'),
                                                borderRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Edit</Text>
                                        </Button>
                                    </Right>
                                </View>
                            </CardItem>
                            {(this.state.equipmentArray.length > 0) ?
                                <FlatList
                                    data={this.state.equipmentArray}
                                    keyExtractor={(item, index) => item.id}
                                    renderItem={({ item }) => (item.status !== 6) ? this.renderEquipList(item) : null}
                                    extraData={this.state}
                                />
                                :
                                <Text style={{ fontSize: hp('2.5%'), color: '#9B9B9B', paddingLeft: wp('3%') }}>No Equipments to display</Text>
                            }
                        </Card>

                        <Card>
                            <CardItem header bordered>
                                <View style={{ flexDirection: 'row' }}>
                                    <Left>
                                        <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Material</Text>
                                    </Left>
                                    <Right>
                                        <Button
                                            onPress={() => Actions.push('materialList', { parentComponent: this, fromEditTimesheet: true })}
                                            style={{
                                                height: hp('4.5%'),
                                                backgroundColor: '#C62828',
                                                width: wp('11%'),
                                                borderRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Edit</Text>
                                        </Button>
                                    </Right>
                                </View>
                            </CardItem>
                            {(this.state.materialArray.length > 0) ?
                                <FlatList
                                    data={this.state.materialArray}
                                    keyExtractor={(item, index) => item.id}
                                    renderItem={({ item }) => (item.status !== 6) ? this.renderMaterialList(item) : null}
                                    extraData={this.state}
                                />
                                :
                                <Text style={{ fontSize: hp('2.5%'), color: '#9B9B9B', paddingLeft: wp('3%') }}>No Materials to display</Text>
                            }
                        </Card>

                        <Card>
                            <CardItem header bordered>
                                <View style={{ flexDirection: 'row' }}>
                                    <Left>
                                        <Text style={{ fontWeight: 'bold', fontSize: hp('2.5%') }}>Expenses</Text>
                                    </Left>
                                    <Right>
                                        <Button
                                            onPress={() => Actions.push('editTimesheetExpenses', { parentComponent: this })}
                                            style={{
                                                height: hp('4.5%'),
                                                backgroundColor: '#C62828',
                                                width: wp('11%'),
                                                borderRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Edit</Text>
                                        </Button>
                                    </Right>
                                </View>
                            </CardItem>
                            {(this.state.expenseArray.length > 0) ?
                                <FlatList
                                    data={this.state.expenseArray}
                                    keyExtractor={(item, index) => item.id}
                                    renderItem={({ item }) => (item.status !== 6) ? this.renderExpenseList(item) : null}
                                    extraData={this.state}
                                />
                                :
                                <Text style={{ fontSize: hp('2.5%'), color: '#9B9B9B', paddingLeft: wp('3%') }}>No Expenses to display</Text>
                            }
                        </Card>
                    </View>
                </ScrollView>

                {(this.state.isUpdating) ?
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

export default connect(null, mapDispatchToProps)(EditTimesheet);