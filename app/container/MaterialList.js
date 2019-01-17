import React, { Component } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native';
import { Container, Button, Icon, Header, Left, Right } from 'native-base'
import { EventRegister } from 'react-native-event-listeners';
import Picker from 'react-native-picker';
import Icons from 'react-native-vector-icons/AntDesign';
import { Actions } from 'react-native-router-flux';
import baseUrl from '../config/baseUrl';
import { removeUser } from '../redux/actions/operations';
import { connect } from 'react-redux';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const KEYS_TO_FILTERS = ['materialName', 'id'];

class MaterialList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            getMatList: [],
            searchTerm: ''
        };
    }

    componentDidMount = () => {
        this.getMaterialList();
    }

    check = () => {
        if (this.props.fromEditTimesheet) {
            if (this.props.navigation.state.params.parentComponent.state.materialArray.length > 0) {
                let array = this.props.navigation.state.params.parentComponent.state.materialArray;
                let array2 = this.state.getMatList.slice();

                for (let i in array2) {
                    for (let k in array)
                        if (array[k].id === array2[i].id) {
                            array2[i].selected = true;
                            array2[i].quantity = parseInt(array[k].quantity);
                            array2[i].halfValue = parseInt(array[k].halfValue);
                        }
                }
                this.setState({
                    getMatList: array2,
                    selectedItems: array
                });
            }
        }
        else {
            if (this.props.parentComponent4.state.selectedValues.length > 0) {
                let array = this.props.parentComponent4.state.selectedValues;
                let array2 = this.state.getMatList.slice();

                for (let i in array2) {
                    for (let k in array)
                        if (array[k].id === array2[i].id) {
                            array2[i].selected = true;
                            array2[i].quantity = array[k].quantity;
                            array2[i].halfValue = array[k].halfValue;
                        }
                }
                this.setState({
                    getMatList: array2,
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

    getMaterialList = () => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingMaterials: true }, () => {
                fetch(`${baseUrl.url}material/list`, {
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
                                getMatList: responseJson.payload,
                                isFetchingMaterials: false
                            }, () => this.check());
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isFetchingMaterials: false }, () => {
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
                                this.setState({ isFetchingMaterials: false }, () => {
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

    //custom picker to choose quantity and units
    showTimePicker = (item) => {
        if (!item.selected) {

            item.selected = true;

            let quantity = [],
                half = [0, .5];

            for (let i = 1; i < 1000; i++) {
                quantity.push(i);
            }

            let unitType = item.measurement;

            let pickerData = [quantity, half];

            Picker.init({
                pickerData,
                pickerTitleText: `Quantity(${unitType})`,
                wheelFlex: [3, 3],
                onPickerConfirm: (pickedValue) => {
                    if (this.props.fromEditTimesheet) {
                        item.quantity = pickedValue[0];
                        item.halfValue = pickedValue[1];
                        let materials = this.state.getMatList.slice();
                        let selectedMaterials = this.state.selectedItems.slice();
                        selectedMaterials.push(item);

                        for (let k in materials) {
                            if (materials[k].id === item.id) {
                                materials[k].selected = item.selected;
                                break;
                            }
                        }

                        let serverMat = this.props.navigation.state.params.parentComponent.state.fromServerMaterial;
                        for (let p in serverMat) {
                            if (serverMat[p].materialDTO.id === item.id && serverMat[p].quantity !== item.quantity.toString()) {
                                serverMat[p].status = '2';
                                serverMat[p].quantity = item.quantity;
                                break;
                            }
                            else if (serverMat[p].materialDTO.id === item.id && serverMat[p].quantity === item.quantity.toString()) {
                                serverMat[p].status = '1';
                                break;
                            }
                        }

                        let count = 0;
                        for (let j in serverMat) {
                            if (serverMat[j].materialDTO.id !== item.id) {
                                count++;
                            }
                        }
                        if (count === serverMat.length) {
                            let matItem = {
                                materialDTO: {
                                    id: item.id
                                },
                                materialName: item.materialName,
                                measurement: item.measurement,
                                quantity: item.quantity,
                                status: '7'
                            }
                            serverMat.push(matItem);
                        }

                        this.setState({
                            getMatList: materials,
                            selectedItems: selectedMaterials
                        }, () => this.props.navigation.state.params.parentComponent.setState({
                            materialArray: selectedMaterials,
                            fromServerMaterial: serverMat
                        }));
                    }
                    else {
                        item.quantity = pickedValue[0];
                        item.halfValue = pickedValue[1];
                        let materials = this.state.getMatList.slice();
                        let selectedMaterials = this.state.selectedItems.slice();
                        selectedMaterials.push(item);

                        for (let k in materials) {
                            if (materials[k].id === item.id) {
                                materials[k].selected = item.selected;
                                break;
                            }
                        }

                        this.setState({
                            getMatList: materials,
                            selectedItems: selectedMaterials
                        }, () => EventRegister.emit('myCustomEvent3', this.state.selectedItems),
                            this.setState(
                                () => this.props.parentComponent4.setState({
                                    selectedValues: selectedMaterials
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
                item.quantity = '';
                item.halfValue = '';
                let materials = this.state.getMatList.slice();
                let selectedMaterials = this.state.selectedItems.slice();
                selectedMaterials = selectedMaterials.filter((existItem) => existItem.id !== item.id);

                for (let k in materials) {
                    if (materials[k].id === item.id) {
                        materials[k].selected = item.selected;
                        break;
                    }
                }

                let serverMat = this.props.navigation.state.params.parentComponent.state.fromServerMaterial;
                let serverMatIds = this.props.navigation.state.params.parentComponent.state.materialIds;

                for (let q in serverMatIds) {
                    if (serverMatIds[q]['id'] === item.id) {
                        for (let p in serverMat) {
                            if (serverMat[p].materialDTO.id === item.id) {
                                serverMat[p].status = '6';
                                serverMat[p].quantity = serverMatIds[q]['quantity'];
                                break;
                            }
                        }
                    }
                }

                let count = 0;
                for (let q in serverMatIds) {
                    if (serverMatIds[q]['id'] !== item.id) {
                        count++;
                    }
                }
                if (count === serverMatIds.length) {
                    serverMat = serverMat.filter((existItem) => existItem.materialDTO.id !== item.id);
                }

                this.setState({
                    getMatList: materials,
                    selectedItems: selectedMaterials
                }, () => this.props.navigation.state.params.parentComponent.setState({
                    materialArray: selectedMaterials,
                    fromServerMaterial: serverMat
                }));
            }
            else {
                item.selected = false;
                item.quantity = '';
                item.halfValue = '';
                let materials = this.state.getMatList.slice();
                let selectedMaterials = this.state.selectedItems.slice();
                selectedMaterials = selectedMaterials.filter((existItem) => existItem.id !== item.id);

                for (let k in materials) {
                    if (materials[k].id === item.id) {
                        materials[k].selected = item.selected;
                        break;
                    }
                }

                this.setState({
                    getMatList: materials,
                    selectedItems: selectedMaterials
                }, () => EventRegister.emit('myCustomEvent3', this.state.selectedItems),
                    this.setState(
                        () => this.props.parentComponent4.setState({
                            selectedValues: selectedMaterials
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
            item.quantity = '';
            item.halfValue = '';
            return item;
        });

        if (this.props.fromEditTimesheet) {
            let serverMat = this.props.navigation.state.params.parentComponent.state.fromServerMaterial;
            let serverMatIds = this.props.navigation.state.params.parentComponent.state.materialIds;

            for (let p in serverMat) {
                for (let q in serverMatIds) {
                    if (serverMat[p].materialDTO.id === serverMatIds[q]['id']) {
                        serverMat[p].status = '6';
                        serverMat[p].quantity = serverMatIds[q]['quantity'];
                    }
                }
            }

            serverMat = serverMat.filter((existItem) => existItem.status === '6');

            this.setState({ selectedItems: stateQuipList }, () => {
                Alert.alert(
                    'Success',
                    'Cleared all selected Materials',
                    [
                        {
                            text: 'OK', onPress: () => this.setState({ selectedItems: [] },
                                () => this.props.navigation.state.params.parentComponent.setState({
                                    materialArray: this.state.selectedItems,
                                    fromServerMaterial: serverMat
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
                    'Cleared all selected Materials',
                    [
                        {
                            text: 'OK', onPress: () => this.setState({ selectedItems: [] },
                                () => this.props.parentComponent4.setState({
                                    selectedValues: this.state.selectedItems
                                }, () => EventRegister.emit('myCustomEvent3', this.state.selectedItems), Actions.pop()))
                        }
                    ],
                    { cancelable: false }
                );
            });
        }
    }

    render = () => {
        const tmpArray = this.state.getMatList;
        const filteredList = tmpArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

        return (
            <Container>
                <Header style={{ backgroundColor: '#3a5997', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.1 }}>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icons name='left' style={{ fontSize: hp('3%'), color: '#FFFFFF' }} />
                            </Button>
                        </View>
                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Add Material</Text>
                        </View>
                        <View style={{ flex: 0.1 }} />
                    </View>
                </Header>

                <View style={{ flexDirection: 'row' }}>
                    <SearchInput
                        onChangeText={(term) => { this.searchUpdated(term) }}
                        style={{
                            borderColor: '#CCC',
                            borderWidth: 1,
                            width: wp('85%'),
                            height: hp('6%'),
                            marginTop: hp('1%'),
                            marginLeft: wp('1%'),
                            padding: hp('1%'),
                            fontSize: hp('2.5%')
                        }}
                        placeholder="     Start typing to search.."
                    />
                    <Button
                        style={{
                            width: wp('12%'),
                            height: hp('6%'),
                            backgroundColor: '#008b00',
                            justifyContent: 'center',
                            borderRadius: 8,
                            marginLeft: wp('1%'),
                            marginRight: wp('1%'),
                            marginTop: hp('1%')
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
                    {(this.state.isFetchingMaterials === false) ?
                        (filteredList.length !== 0) ?
                            <View>
                                <Text style={{ alignSelf: 'flex-start', fontSize: hp('2%') }}> Select material from the list below.</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                                                                    backgroundColor: '#e1f3fd',
                                                                    alignItems: 'center',
                                                                    paddingLeft: 20,
                                                                    paddingRight: 20,
                                                                    flexDirection: 'row',
                                                                    width: '100%',
                                                                    height: '100%'
                                                                }}
                                                            >
                                                                {/* <Icon name='checkbox' style={{ color: 'white', fontSize: hp('3.5%') }} /> */}
                                                                <View style={{ flexDirection: 'column', paddingLeft: 20 }}>
                                                                    <Text style={{ color: 'black', fontSize: hp('2.5%') }}>
                                                                        {item.materialName}
                                                                    </Text>
                                                                </View>
                                                                <Right>
                                                                    <Text style={{ color: '#bbbdc0', textAlign: 'center', fontSize: hp('2%') }}>
                                                                        {item.quantity + item.halfValue} {item.measurement}
                                                                    </Text>
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
                                                                        <Text style={{ color: 'black', fontSize: hp('2.5%') }}>
                                                                            {item.materialName}
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
                                    No matching materials.
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

export default connect(null, mapDispatchToProps)(MaterialList);