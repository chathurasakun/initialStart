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
import FastImage from 'react-native-fast-image';
import { removeUser } from '../redux/actions/operations';
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const KEYS_TO_FILTERS = ['firstName', 'id', 'skill', 'lastName'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1000;
let options = ['Cancel'];
const title = 'Select a skill';
const message = 'Select a different skill type instead of default skill';

class LabourList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            getLabourList: [],
            searchTerm: '',
            skilltype: []
        };
    }

    componentWillMount = () => {
        this.getLaborSkilltypes();
    }

    componentDidMount = () => {
        this.getLabourList();
        this.getLaborSkilltypes();
    }

    check = () => {
        if (this.props.fromEditTimesheet) {
            if (this.props.navigation.state.params.parentComponent.state.laborArray.length > 0) {
                let array = this.props.navigation.state.params.parentComponent.state.laborArray;
                let array2 = this.state.getLabourList.slice();

                for (let i in array2) {
                    for (let k in array)
                        if (array[k].id === array2[i].id) {
                            array2[i].selected = true;
                            array2[i].hours = array[k].hours;
                            array2[i].minutes = array[k].minutes;
                            array2[i].skillDTO.skillName = array[k].skill;
                        }
                }
                this.setState({
                    getLabourList: array2,
                    selectedItems: array
                });
            }
        }
        else {
            if (this.props.parentComponent.state.selectedValues.length > 0) {
                let array = this.props.parentComponent.state.selectedValues;
                let array2 = this.state.getLabourList.slice();

                for (let i in array2) {
                    for (let k in array)
                        if (array[k].id === array2[i].id) {
                            array2[i].selected = true;
                            array2[i].hours = array[k].hours;
                            array2[i].minutes = array[k].minutes;
                            array2[i].skillDTO.skillName = array[k].skillDTO.skillName;
                        }
                }
                this.setState({
                    getLabourList: array2,
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

    getLabourList = () => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingLabours: true }, () => {
                fetch(`${baseUrl.url}worker/list`, {
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
                                getLabourList: responseJson.payload,
                                isFetchingLabours: false
                            }, () => this.check());
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isFetchingLabours: false }, () => {
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
                                this.setState({ isFetchingLabours: false }, () => {
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

    getLaborSkilltypes = () => {
        AsyncStorage.getItem('key').then((token) => {
            fetch(`${baseUrl.url}skill/list`, {
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
                            skilltype: responseJson.payload,
                        }, () => {
                            let optionArray1 = this.getSkillArray(responseJson.payload);
                            optionArray1.push('Default Skill');
                            let optionArray2 = ['Cancel'];
                            options = optionArray2.concat(optionArray1);
                        });
                    }
                })
        });
    }

    getSkillArray = (skillArray) => {
        let skill = [];
        for (let i in skillArray) {
            skill.push(skillArray[i].skillName);
        }
        return skill;
    }

    getskillId = (skill) => {
        let id;
        let skillset = this.state.skilltype;
        for (let i in skillset) {
            if (skillset[i].skillName === skill) {
                id = skillset[i].id;
                break;
            }
        }
        return id;
    }

    //custom picker to choose quantity and units
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
                pickerConfirmBtnText: 'Next',
                wheelFlex: [1, 1],
                onPickerConfirm: (pickedValue) => {
                    if (this.props.fromEditTimesheet) {
                        item.hours = pickedValue[0];
                        item.minutes = pickedValue[1];

                        if ((item.hours + item.minutes / 60) > 13) {
                            Alert.alert(
                                '',
                                'Number of hours selected is higher than 13. Please confirm!',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => {
                                            this.ActionSheet.show();
                                            let labours = this.state.getLabourList.slice();
                                            let selectedlabour = this.state.selectedItems.slice();
                                            selectedlabour.push(item);

                                            for (let k in labours) {
                                                if (labours[k].id === item.id) {
                                                    labours[k].selected = item.selected;
                                                    break;
                                                }
                                            }

                                            let serverLabor = this.props.navigation.state.params.parentComponent.state.fromServerLabor;
                                            for (let p in serverLabor) {
                                                if (serverLabor[p].workerDTO.id === item.id && serverLabor[p].hours !== item.hours.toString()) {
                                                    serverLabor[p].status = '2';
                                                    serverLabor[p].hours = item.hours;
                                                    break;
                                                }
                                                else if (serverLabor[p].workerDTO.id === item.id && serverLabor[p].hours === item.hours.toString()) {
                                                    serverLabor[p].status = '1';
                                                    break;
                                                }
                                            }

                                            let count = 0;
                                            for (let j in serverLabor) {
                                                if (serverLabor[j].workerDTO.id !== item.id) {
                                                    count++;
                                                }
                                            }
                                            if (count === serverLabor.length) {
                                                let laborItem = {
                                                    workerDTO: {
                                                        id: item.id
                                                    },
                                                    firstName: item.firstName,
                                                    lastName: item.lastName,
                                                    hours: item.hours,
                                                    status: '7',
                                                    skillDTO: {
                                                        skillName: item.skillDTO.skillName,
                                                        id: item.skillDTO.id
                                                    }
                                                }
                                                serverLabor.push(laborItem);
                                            }

                                            this.setState({
                                                getLabourList: labours,
                                                selectedItems: selectedlabour
                                            }, () => this.props.navigation.state.params.parentComponent.setState({
                                                fromServerLabor: serverLabor
                                            }));
                                        }
                                    },
                                    {
                                        text: 'Cancel',
                                        onPress: () => {
                                            item.selected = false;
                                        }
                                    }
                                ],
                            )
                        }
                        else {
                            this.ActionSheet.show();
                            let labours = this.state.getLabourList.slice();
                            let selectedlabour = this.state.selectedItems.slice();
                            selectedlabour.push(item);

                            for (let k in labours) {
                                if (labours[k].id === item.id) {
                                    labours[k].selected = item.selected;
                                    break;
                                }
                            }

                            let serverLabor = this.props.navigation.state.params.parentComponent.state.fromServerLabor;
                            for (let p in serverLabor) {
                                if (serverLabor[p].workerDTO.id === item.id && serverLabor[p].hours !== item.hours.toString()) {
                                    serverLabor[p].status = '2';
                                    serverLabor[p].hours = item.hours;
                                    break;
                                }
                                else if (serverLabor[p].workerDTO.id === item.id && serverLabor[p].hours === item.hours.toString()) {
                                    serverLabor[p].status = '1';
                                    break;
                                }
                            }

                            let count = 0;
                            for (let j in serverLabor) {
                                if (serverLabor[j].workerDTO.id !== item.id) {
                                    count++;
                                }
                            }
                            if (count === serverLabor.length) {
                                let laborItem = {
                                    workerDTO: {
                                        id: item.id
                                    },
                                    firstName: item.firstName,
                                    lastName: item.lastName,
                                    hours: item.hours,
                                    status: '7',
                                    skillDTO: {
                                        skillName: item.skillDTO.skillName,
                                        id: item.skillDTO.id
                                    }
                                }
                                serverLabor.push(laborItem);
                            }

                            this.setState({
                                getLabourList: labours,
                                selectedItems: selectedlabour
                            }, () => this.props.navigation.state.params.parentComponent.setState({
                                fromServerLabor: serverLabor
                            }));
                        }
                    }
                    else {
                        item.hours = pickedValue[0];
                        item.minutes = pickedValue[1];

                        if ((item.hours + item.minutes / 60) > 13) {
                            Alert.alert(
                                '',
                                'Number of hours selected is higher than 13. Please confirm!',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => {
                                            this.ActionSheet.show();
                                            let labours = this.state.getLabourList.slice();
                                            let selectedlabour = this.state.selectedItems.slice();
                                            selectedlabour.push(item);

                                            for (let k in labours) {
                                                if (labours[k].id === item.id) {
                                                    labours[k].selected = item.selected;
                                                    break;
                                                }
                                            }

                                            this.setState({
                                                getLabourList: labours,
                                                selectedItems: selectedlabour
                                            },
                                                this.setState(
                                                    () => this.props.parentComponent.setState({
                                                        selectedValues: selectedlabour
                                                    })));
                                        },
                                    },
                                    {
                                        text: 'Cancel',
                                        onPress: () => {
                                            item.selected = false;
                                        }
                                    }
                                ],
                            )
                        }
                        else {
                            this.ActionSheet.show();
                            let labours = this.state.getLabourList.slice();
                            let selectedlabour = this.state.selectedItems.slice();
                            selectedlabour.push(item);

                            for (let k in labours) {
                                if (labours[k].id === item.id) {
                                    labours[k].selected = item.selected;
                                    break;
                                }
                            }

                            this.setState({
                                getLabourList: labours,
                                selectedItems: selectedlabour
                            },
                                this.setState(
                                    () => this.props.parentComponent.setState({
                                        selectedValues: selectedlabour
                                    })));
                        }
                    }
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
                let labours = this.state.getLabourList.slice();
                let selectedlabour = this.state.selectedItems.slice();
                selectedlabour = selectedlabour.filter((existItem) => existItem.id !== item.id);

                for (let k in labours) {
                    if (labours[k].id === item.id) {
                        labours[k].selected = item.selected;
                        break;
                    }
                }

                let serverLabor = this.props.navigation.state.params.parentComponent.state.fromServerLabor;
                let serverLaborIds = this.props.navigation.state.params.parentComponent.state.laborIds;

                for (let q in serverLaborIds) {
                    if (serverLaborIds[q]['id'] === item.id) {
                        for (let p in serverLabor) {
                            if (serverLabor[p].workerDTO.id === item.id) {
                                serverLabor[p].status = '6';
                                serverLabor[p].hours = serverLaborIds[q]['hours'];
                                serverLabor[p].skillDTO.skillName = serverLaborIds[q]['skill'];
                                serverLabor[p].skillDTO.id = serverLaborIds[q]['skillId'];
                                break;
                            }
                        }
                    }
                }

                let count = 0;
                for (let q in serverLaborIds) {
                    if (serverLaborIds[q]['id'] !== item.id) {
                        count++;
                    }
                }
                if (count === serverLaborIds.length) {
                    serverLabor = serverLabor.filter((existItem) => existItem.workerDTO.id !== item.id);
                }

                this.setState({
                    getLabourList: labours,
                    selectedItems: selectedlabour
                }, () => this.props.navigation.state.params.parentComponent.setState({
                    laborArray: selectedlabour,
                    fromServerLabor: serverLabor
                }));
            }
            else {
                item.selected = false;
                item.hours = '';
                item.minutes = '';
                let labours = this.state.getLabourList.slice();
                let selectedlabour = this.state.selectedItems.slice();
                selectedlabour = selectedlabour.filter((existItem) => existItem.id !== item.id);

                for (let k in labours) {
                    if (labours[k].id === item.id) {
                        labours[k].selected = item.selected;
                        break;
                    }
                }

                this.setState({
                    getLabourList: labours,
                    selectedItems: selectedlabour
                }, () => EventRegister.emit('myCustomEvent1', this.state.selectedItems),
                    this.setState(
                        () => this.props.parentComponent.setState({
                            selectedValues: selectedlabour
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
            let serverLabor = this.props.navigation.state.params.parentComponent.state.fromServerLabor;
            let serverLaborIds = this.props.navigation.state.params.parentComponent.state.laborIds;

            for (let p in serverLabor) {
                for (let q in serverLaborIds) {
                    if (serverLabor[p].workerDTO.id === serverLaborIds[q]['id']) {
                        serverLabor[p].status = '6';
                        serverLabor[p].hours = serverLaborIds[q]['hours'];
                    }
                }
            }

            serverLabor = serverLabor.filter((existItem) => existItem.status === '6');

            this.setState({ selectedItems: stateQuipList }, () => {
                Alert.alert(
                    'Success',
                    'Cleared all selected Labours',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({ selectedItems: [] }, () => this.props.navigation.state.params.parentComponent.setState({
                                    laborArray: this.state.selectedItems,
                                    fromServerLabor: serverLabor
                                }));
                                Actions.pop();
                            }
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
                    'Cleared all selected Labours',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({ selectedItems: [] }, () => this.props.parentComponent.setState({
                                    selectedValues: this.state.selectedItems
                                }, () => EventRegister.emit('myCustomEvent1', this.state.selectedItems)));
                                Actions.pop();
                            }
                        }
                    ],
                    { cancelable: false }
                );
            });
        }
    }

    handlePress = (buttonIndex) => {
        let selectedLabor = this.state.selectedItems.slice();

        if (this.props.fromEditTimesheet) {
            if (buttonIndex !== 0 && buttonIndex !== options.length - 1) {
                let lastLabor = selectedLabor.pop();
                lastLabor['skill'] = options[buttonIndex];
                lastLabor['skillDTO']['skillName'] = options[buttonIndex];
                lastLabor['skillDTO']['id'] = this.getskillId(options[buttonIndex]);
                selectedLabor.push(lastLabor);

                this.setState({
                    selectedItems: selectedLabor
                }, () => this.props.navigation.state.params.parentComponent.setState({
                    laborArray: selectedLabor
                }));
            }
            else {
                let lastLabor = selectedLabor.pop();
                lastLabor['skill'] = lastLabor['skillDTO']['skillName'];
                selectedLabor.push(lastLabor);

                this.setState(() => this.props.navigation.state.params.parentComponent.setState({
                    laborArray: selectedLabor
                }));
            }
        }
        else {
            if (buttonIndex !== 0 && buttonIndex !== options.length - 1) {
                let lastLabor = selectedLabor.pop();
                lastLabor['skillDTO']['skillName'] = options[buttonIndex];
                lastLabor['skillDTO']['id'] = this.getskillId(options[buttonIndex]);
                selectedLabor.push(lastLabor);

                this.setState({
                    selectedItems: selectedLabor
                }, () => EventRegister.emit('myCustomEvent1', this.state.selectedItems));

                this.props.parentComponent.setState({
                    selectedValues: selectedLabor
                });
            }
            else {
                this.setState(() => EventRegister.emit('myCustomEvent1', this.state.selectedItems));
            }
        }
        Actions.pop();
    }

    render = () => {
        const tmpArray = this.state.getLabourList;
        const filteredList = tmpArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

        return (
            <Container>
                <Header style={{ backgroundColor: '#021aee', height: hp('7.5%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icons name='left' style={{ fontSize: hp('2%'), color: '#FFFFFF', fontWeight: 'bold' }} />
                            </Button>
                        </Left>
                        <View style={{ width: (Metrics.screenWidth / 4) * 2, alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Add Labor</Text>
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
                    {(this.state.isFetchingLabours === false) ?
                        (filteredList.length !== 0) ?
                            <View>
                                <Text style={{ alignSelf: 'flex-start', fontSize: hp('2%') }}> Select workers from the list below.</Text>
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
                                                                            {item.firstName} {item.lastName}
                                                                        </Text>
                                                                        <Text style={{ color: 'white', fontSize: hp('2%') }}>
                                                                            {item.skillDTO.skillName}
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
                                                                paddingRight: 20,
                                                                alignItems: 'center'
                                                            }}
                                                            >
                                                                <Left style={{ flexDirection: 'row' }}>
                                                                    <FastImage
                                                                        style={{
                                                                            width: hp('8%'),
                                                                            height: hp('8%'),
                                                                            borderRadius: hp('8%') / 2
                                                                        }}
                                                                        source={{ uri: item.img }}
                                                                    />
                                                                    <View style={{ flexDirection: 'column', paddingLeft: 20 }}>
                                                                        <Text style={{ color: '#9B9B9B', fontSize: hp('2.5%') }}>
                                                                            {item.firstName} {item.lastName}
                                                                        </Text>
                                                                        <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>
                                                                            [{item.skillDTO.skillName}]
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
                                    No matching labours.
                                </Text>
                            </View>
                        :
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: hp('50%') }}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                    }
                </ScrollView>

                <ActionSheet
                    ref={o => { this.ActionSheet = o }}
                    title={title}
                    message={message}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}
                />
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

export default connect(null, mapDispatchToProps)(LabourList);