import React, { Component } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { Container, Button, Icon, Right, Left, Header } from 'native-base'
import { EventRegister } from 'react-native-event-listeners';
import Picker from 'react-native-picker';
import SearchInput, { createFilter } from 'react-native-search-filter';
import Metrics from '../utils/matrics';
import baseUrl from '../config/baseUrl';
import Icons from 'react-native-vector-icons/AntDesign';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { removeUser } from '../redux/actions/operations';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const KEYS_TO_FILTERS = ['name', 'id', 'skill'];

class EquipmentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            getEquipList: [],
            searchTerm: ''
        };
    }

    componentDidMount = () => {
        this.getEquipmentList();
    }

    check = () => {
        if (this.props.fromEditTimesheet) {
            if (this.props.navigation.state.params.parentComponent.state.equipmentArray.length > 0) {
                let array = this.props.navigation.state.params.parentComponent.state.equipmentArray;
                let array2 = this.state.getEquipList.slice();

                for (let i in array2) {
                    for (let k in array)
                        if (array[k].id === array2[i].id) {
                            array2[i].selected = true;
                            array2[i].hours = array[k].hours;
                            array2[i].minutes = array[k].minutes;
                        }
                }
                this.setState({
                    getEquipList: array2,
                    selectedItems: array
                });
            }
        }
        else {
            if (this.props.parentComponent3.state.selectedValues.length > 0) {
                let array = this.props.parentComponent3.state.selectedValues;
                let array2 = this.state.getEquipList.slice();

                for (let i in array2) {
                    for (let k in array)
                        if (array[k].id === array2[i].id) {
                            array2[i].selected = true;
                            array2[i].hours = array[k].hours;
                            array2[i].minutes = array[k].minutes;
                        }
                }
                this.setState({
                    getEquipList: array2,
                    selectedItems: array
                });
            }
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

    getEquipmentList = () => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingEquipments: true }, () => {
                fetch(`${baseUrl.url}equipment/list`, {
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
                                getEquipList: responseJson.payload,
                                isFetchingEquipments: false
                            }, () => this.check());
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isFetchingEquipments: false }, () => {
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
                                this.setState({ isFetchingEquipments: false }, () => {
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
        });
    }

    //custom picker to choose hours and minutes
    showTimePicker = (item) => {
        if (!item.selected) {

            item.selected = true;

            let hours = [],
                minutes = [0, 15, 30, 45];

            for (let i = 1; i < 21; i++) {
                hours.push(i);
            }

            let pickerData = [hours, minutes];

            Picker.init({
                pickerData,
                pickerTitleText: 'Select Hours & Minutes',
                wheelFlex: [1, 1],
                onPickerConfirm: (pickedValue) => {
                    if (this.props.fromEditTimesheet) {
                        item.hours = pickedValue[0];
                        item.minutes = pickedValue[1];
                        let quipments = this.state.getEquipList.slice();
                        let selectedEquips = this.state.selectedItems.slice();
                        selectedEquips.push(item);

                        for (let k in quipments) {
                            if (quipments[k].id === item.id) {
                                quipments[k].selected = item.selected;
                                break;
                            }
                        }

                        let serverEquip = this.props.navigation.state.params.parentComponent.state.fromServerEquip;
                        for (let p in serverEquip) {
                            if (serverEquip[p].equipmentDTO.id === item.id && serverEquip[p].hours !== item.hours.toString()) {
                                serverEquip[p].status = '2';
                                serverEquip[p].hours = item.hours;
                                break;
                            }
                            else if (serverEquip[p].equipmentDTO.id === item.id && serverEquip[p].hours === item.hours.toString()) {
                                serverEquip[p].status = '1';
                                break;
                            }
                        }

                        let count = 0;
                        for (let j in serverEquip) {
                            if (serverEquip[j].equipmentDTO.id !== item.id) {
                                count++;
                            }
                        }
                        if (count === serverEquip.length) {
                            let equipItem = {
                                equipmentDTO: {
                                    id: item.id
                                },
                                equipmentName: item.equipmentName,
                                equipmentNumber: item.equipmentNumber,
                                hours: item.hours,
                                status: '7'
                            }
                            serverEquip.push(equipItem);
                        }

                        this.setState({
                            getEquipList: quipments,
                            selectedItems: selectedEquips
                        }, () => this.props.navigation.state.params.parentComponent.setState({
                            equipmentArray: selectedEquips,
                            fromServerEquip: serverEquip
                        }));
                    }
                    else {
                        item.hours = pickedValue[0];
                        item.minutes = pickedValue[1];
                        let quipments = this.state.getEquipList.slice();
                        let selectedEquips = this.state.selectedItems.slice();
                        selectedEquips.push(item);

                        for (let k in quipments) {
                            if (quipments[k].id === item.id) {
                                quipments[k].selected = item.selected;
                                break;
                            }
                        }

                        this.setState({
                            getEquipList: quipments,
                            selectedItems: selectedEquips
                        }, () => EventRegister.emit('myCustomEvent2', this.state.selectedItems),
                            this.setState(
                                () => this.props.parentComponent3.setState({
                                    selectedValues: selectedEquips
                                })));
                    }

                    Actions.pop();
                },
                onPickerCancel: () => {
                    if (item.selected)
                        item.selected = false;
                },
                onPickerSelect: (pickedValue) => {
                    let targetValue = [...pickedValue];
                    if (parseInt(targetValue[1]) === 2) {
                        if (targetValue[0] % 4 === 0 && targetValue[2] > 29) {
                            targetValue[2] = 29;
                        }
                        else if (targetValue[0] % 4 !== 0 && targetValue[2] > 28) {
                            targetValue[2] = 28;
                        }
                    }
                    else if (targetValue[1] in { 4: 1, 6: 1, 9: 1, 11: 1 } && targetValue[2] > 30) {
                        targetValue[2] = 30;

                    }
                    if (JSON.stringify(targetValue) !== JSON.stringify(pickedValue)) {
                        targetValue.map((v, k) => {
                            if (k !== 3) {
                                targetValue[k] = parseInt(v);
                            }
                        });
                        Picker.select(targetValue);
                        pickedValue = targetValue;
                    }
                }
            });

            Picker.show();
        }
        else {
            if (this.props.fromEditTimesheet) {
                item.selected = false;
                item.hours = '';
                item.minutes = '';
                let quipments = this.state.getEquipList.slice();
                let selectedEquipments = this.state.selectedItems.slice();
                selectedEquipments = selectedEquipments.filter((existItem) => existItem.id !== item.id);

                for (let k in quipments) {
                    if (quipments[k].id === item.id) {
                        quipments[k].selected = item.selected;
                        break;
                    }
                }

                let serverEquip = this.props.navigation.state.params.parentComponent.state.fromServerEquip;
                let serverEquipIds = this.props.navigation.state.params.parentComponent.state.equipIds;

                for (let q in serverEquipIds) {
                    if (serverEquipIds[q]['id'] === item.id) {
                        for (let p in serverEquip) {
                            if (serverEquip[p].equipmentDTO.id === item.id) {
                                serverEquip[p].status = '6';
                                serverEquip[p].hours = serverEquipIds[q]['hours'];
                                break;
                            }
                        }
                    }
                }

                let count = 0;
                for (let q in serverEquipIds) {
                    if (serverEquipIds[q]['id'] !== item.id) {
                        count++;
                    }
                }
                if (count === serverEquipIds.length) {
                    serverEquip = serverEquip.filter((existItem) => existItem.equipmentDTO.id !== item.id);
                }

                this.setState({
                    getEquipList: quipments,
                    selectedItems: selectedEquipments
                }, () => this.props.navigation.state.params.parentComponent.setState({
                    equipmentArray: selectedEquipments,
                    fromServerEquip: serverEquip
                }));
            }
            else {
                item.selected = false;
                item.hours = '';
                item.minutes = '';
                let quipments = this.state.getEquipList.slice();
                let selectedEquipments = this.state.selectedItems.slice();
                selectedEquipments = selectedEquipments.filter((existItem) => existItem.id !== item.id);

                for (let k in quipments) {
                    if (quipments[k].id === item.id) {
                        quipments[k].selected = item.selected;
                        break;
                    }
                }

                this.setState({
                    getEquipList: quipments,
                    selectedItems: selectedEquipments
                }, () => EventRegister.emit('myCustomEvent2', this.state.selectedItems),
                    this.setState(
                        () => this.props.parentComponent3.setState({
                            selectedValues: selectedEquipments
                        })));
            }

            Actions.pop();
        }
    }

    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }

    clearSelectedList = () => {
        const stateQuipList = this.state.selectedItems.map((item) => {
            item.selected = false;
            item.hours = '';
            item.minutes = '';
            return item;
        });

        if (this.props.fromEditTimesheet) {
            let serverEquip = this.props.navigation.state.params.parentComponent.state.fromServerEquip;
            let serverEquipIds = this.props.navigation.state.params.parentComponent.state.equipIds;

            for (let p in serverEquip) {
                for (let q in serverEquipIds) {
                    if (serverEquip[p].equipmentDTO.id === serverEquipIds[q]['id']) {
                        serverEquip[p].status = '6';
                        serverEquip[p].hours = serverEquipIds[q]['hours'];
                    }
                }
            }

            serverEquip = serverEquip.filter((existItem) => existItem.status === '6');

            this.setState({ selectedItems: stateQuipList }, () => {
                Alert.alert(
                    'Success',
                    'Cleared all selected Equipments',
                    [
                        {
                            text: 'OK', onPress: () => this.setState({ selectedItems: [] },
                                () => this.props.navigation.state.params.parentComponent.setState({
                                    equipmentArray: this.state.selectedItems,
                                    fromServerEquip: serverEquip
                                }), Actions.pop())
                        }
                    ],
                    { cancelable: false }
                );
            });
        }
        else {
            this.setState({ selectedItems: stateQuipList }, () => {
                Alert.alert(
                    'Success',
                    'Cleared all selected Equipments',
                    [
                        {
                            text: 'OK', onPress: () => this.setState({ selectedItems: [] },
                                () => this.props.parentComponent3.setState({
                                    selectedValues: this.state.selectedItems
                                }, () => EventRegister.emit('myCustomEvent2', this.state.selectedItems), Actions.pop()))
                        }
                    ],
                    { cancelable: false }
                );
            });
        }
    }

    render = () => {
        const tmpArray = this.state.getEquipList;
        const filteredList = tmpArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

        return (
            <Container>
                <Header style={{ backgroundColor: '#021aee', height: hp('7.5%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icons name='left' style={{ fontSize: hp('2%'), color: '#FFFFFF' }} />
                            </Button>
                        </Left>
                        <View style={{ width: (Metrics.screenWidth / 4) * 2, alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Add Equipment</Text>
                        </View>
                        <Right></Right>
                    </View>
                </Header>

                <View style={{ flexDirection: 'row' }}>
                    <SearchInput
                        onChangeText={(term) => { this.searchUpdated(term) }}
                        style={{
                            borderColor: '#CCC',
                            borderWidth: 1,
                            width: wp('86%'),
                            height: hp('6%'),
                            borderRadius: 8,
                            marginTop: hp('1%'),
                            padding: hp('2%'),
                            fontSize: hp('2%')
                        }}
                        placeholder="     Start typing to search.."
                    />
                    <Button
                        style={{
                            alignSelf: 'flex-end',
                            width: wp('12%'),
                            height: hp('6%'),
                            backgroundColor: '#008b00',
                            justifyContent: 'center',
                            borderRadius: 8,
                            marginHorizontal: 5,
                            marginTop: 5
                        }}
                        onPress={() => this.clearSelectedList()}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: hp('2%'),
                                fontWeight: 'normal',
                                textAlign: 'center'
                            }}
                        >
                            Clear
                        </Text>
                    </Button>
                </View>

                <ScrollView>
                    {(this.state.isFetchingEquipments === false) ?
                        (filteredList.length !== 0) ?
                            <View>
                                <Text style={{ alignSelf: 'flex-start', fontSize: hp('2%') }}> Select equipment from the list below.</Text>
                                <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                    {filteredList.map(item => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => this.showTimePicker(item)}
                                            >
                                                <View
                                                    style={{
                                                        width: wp('100%'),
                                                        height: hp('8%'),
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderColor: '#9B9B9B',
                                                        borderWidth: 0.5
                                                    }}
                                                >
                                                    {
                                                        (item.selected) ?
                                                            <View
                                                                style={{
                                                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                                                    alignItems: 'center',
                                                                    paddingLeft: 20,
                                                                    paddingRight: 20,
                                                                    flexDirection: 'row',
                                                                    width: '100%',
                                                                    height: '100%'
                                                                }}
                                                            >
                                                                <Left style={{ flexDirection: 'row' }}>
                                                                    <Icon name='checkbox' style={{ color: 'white', fontSize: hp('3.5%') }} />
                                                                    <View style={{ flexDirection: 'column', paddingLeft: 20 }}>
                                                                        <Text style={{ color: 'white', fontSize: hp('2.5%') }}>
                                                                            {item.equipmentName}
                                                                        </Text>
                                                                        <Text style={{ color: 'white', fontSize: hp('2%') }}>
                                                                            {item.equipmentNumber}
                                                                        </Text>
                                                                    </View>
                                                                </Left>
                                                                <Right>
                                                                    {(item.hours > 1) ?
                                                                        (item.minutes > 0) ?
                                                                            <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                                                                {item.hours} hrs {item.minutes} min
                                                                            </Text>
                                                                            :
                                                                            <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                                                                {item.hours} hrs 0 min
                                                                            </Text>
                                                                        :
                                                                        (item.minutes > 0) ?
                                                                            <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                                                                {item.hours} hr {item.minutes} min
                                                                            </Text>
                                                                            :
                                                                            <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                                                                {item.hours} hr 0 min
                                                                            </Text>
                                                                    }
                                                                </Right>
                                                            </View>
                                                            :
                                                            <View style={{
                                                                flexDirection: 'row',
                                                                paddingLeft: 20,
                                                                alignItems: 'center'
                                                            }}
                                                            >
                                                                <Left style={{ flexDirection: 'row' }}>
                                                                    <View style={{ flexDirection: 'column' }}>
                                                                        <Text style={{ color: '#9B9B9B', fontSize: hp('2.5%') }}>
                                                                            {item.equipmentName}
                                                                        </Text>
                                                                        <View style={{ padding: 2 }} />
                                                                        <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>
                                                                            {item.equipmentNumber}
                                                                        </Text>
                                                                    </View>
                                                                </Left>
                                                            </View>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                            :
                            <View
                                style={{
                                    alignItems: 'center',
                                    marginTop: hp('40%')
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#9B9B9B',
                                        fontSize: hp('2.5%')
                                    }}
                                >
                                    No matching equipments.
                                </Text>
                            </View>
                        :
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: hp('50%') }}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                    }
                </ScrollView>
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

export default connect(null, mapDispatchToProps)(EquipmentList);