import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, AsyncStorage, ActivityIndicator, TextInput } from 'react-native';
import { Container, Header, Button, Left, Right } from 'native-base'
import Metrics from '../utils/matrics';
import baseUrl from '../config/baseUrl';
import { createFilter } from 'react-native-search-filter';
import Icons from 'react-native-vector-icons/AntDesign';
import { Actions } from 'react-native-router-flux';
import { removeUser } from '../redux/actions/operations';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const KEYS_TO_FILTERS = ['firstName', 'lastName', 'email', 'id'];

class ApproverList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: [],
            getList: [],
            searchTerm: ''
        };
    }

    componentDidMount = () => {
        this.getApproverList();
    }

    check = () => {
        let array = this.state.getList.slice();

        if (this.props.fromEditTimesheet) {
            for (let i in array) {
                if (array[i].id === this.props.navigation.state.params.parentComponent.state.approverArray.id) {
                    array[i].selected = true;
                    break;
                }
            }
        }
        else {
            for (let i in array) {
                if (array[i].id === this.props.parentComponent.state.approver.id) {
                    array[i].selected = true;
                    break;
                }
            }
        }
        this.setState({
            getList: array,
            selectedItem: (this.props.fromEditTimesheet) ? this.props.navigation.state.params.parentComponent.state.approverArray : this.props.parentComponent.state.approver
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

    getApproverList = () => {
        let id;
        if (this.props.fromEditTimesheet)
            id = this.props.navigation.state.params.parentComponent.state.purchase_Order_id;
        else
            id = this.props.poObj.id;

        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingApprover: true }, () => {
                fetch(`${baseUrl.url}approver/list/${id}`, {
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
                                getList: responseJson.payload,
                                isFetchingApprover: false
                            }, () => this.check());
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isFetchingApprover: false }, () => {
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
                                this.setState({ isFetchingApprover: false }, () => {
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
                    });
            })
        })
    }

    selectApprover = (item) => {
        if (this.state.selectedItem.length === 0) {
            if (this.props.fromEditTimesheet) {
                item.selected = true;
                this.setState({
                    selectedItem: item
                },
                    () => this.props.navigation.state.params.parentComponent.setState({
                        approverArray: this.state.selectedItem
                    }));
                Actions.pop();
            }
            else {
                item.selected = true;
                this.setState({
                    selectedItem: item
                },
                    () => this.props.parentComponent.setState({
                        approver: this.state.selectedItem
                    }));
                Actions.pop();
            }
        }
        else {
            if (this.state.selectedItem.id !== item.id) {
                Alert.alert(
                    'Info',
                    'You have already selected an approver!',
                    [
                        {
                            text: 'OK', onPress: () => {
                                console.log('already have approver selected');
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }
            else {
                if (this.props.fromEditTimesheet) {
                    let approverArray = this.state.getList.slice();
                    for (let i in approverArray) {
                        if (approverArray[i].id === item.id) {
                            approverArray[i].selected = false;
                            break;
                        }
                    }
                    this.setState({
                        selectedItem: [],
                        getList: approverArray
                    },
                        () => this.props.navigation.state.params.parentComponent.setState({
                            approverArray: this.state.selectedItem
                        }));
                }
                else {
                    let approverArray = this.state.getList.slice();
                    for (let i in approverArray) {
                        if (approverArray[i].id === item.id) {
                            approverArray[i].selected = false;
                            break;
                        }
                    }
                    this.setState({
                        selectedItem: [],
                        getList: approverArray
                    },
                        () => this.props.parentComponent.setState({
                            approver: this.state.selectedItem
                        }));
                }
            }
        }
    }

    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }

    //clearSelectedList = () => {
    // if (this.props.fromEditTimesheet) {
    //     this.setState({ selectedItem: [] }, () => {
    //         Alert.alert(
    //             'Success',
    //             'Cleared selected Approver',
    //             [
    //                 {
    //                     text: 'OK', onPress: () => {
    //                         this.setState(() => this.props.navigation.state.params.parentComponent.setState({
    //                             approverArray: this.state.selectedItem
    //                         }));
    //                         Actions.pop();
    //                     }
    //                 }
    //             ],
    //             { cancelable: false }
    //         );
    //     });
    // }
    // else {
    //     this.setState({ selectedItem: [] }, () => {
    //         Alert.alert(
    //             'Success',
    //             'Cleared selected Approver',
    //             [
    //                 {
    //                     text: 'OK', onPress: () => {
    //                         this.setState(() => this.props.parentComponent.setState({
    //                             approver: this.state.selectedItem
    //                         }));
    //                         Actions.pop();
    //                     }
    //                 }
    //             ],
    //             { cancelable: false }
    //         );
    //     });
    // }
    //}

    render = () => {
        const tmpArray = this.state.getList;
        const filteredList = tmpArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

        return (
            <Container>
                <Header style={{ backgroundColor: '#3a5997', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icons name='left' style={{ fontSize: hp('3%'), color: '#FFFFFF' }} />
                            </Button>
                        </Left>
                        <View style={{ width: (Metrics.screenWidth / 4) * 2, alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Select Approver</Text>
                        </View>
                        <Right></Right>
                    </View>
                </Header>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        ref={input => { this.textInput = input }}
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
                        onPress={() => {
                            this.textInput.clear();
                            this.setState({
                                searchTerm: ''
                            });
                        }}
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
                    {(this.state.isFetchingApprover === false) ?
                        (filteredList.length !== 0) ?
                            <View>
                                <Text style={{ alignSelf: 'flex-start', fontSize: hp('2%') }}> Select an Approver from the list.</Text>
                                <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                    {filteredList.map(item => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => this.selectApprover(item)}
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
                                                                <Left style={{ flexDirection: 'row' }}>
                                                                    {/* <Icon name='checkbox' style={{ color: 'white', fontSize: hp('3.5%') }} /> */}
                                                                    <View style={{ paddingLeft: 20, flexDirection: 'column' }}>
                                                                        <Text style={{ color: 'black', fontSize: hp('2.5%') }}>
                                                                            {item.firstName} {item.lastName}
                                                                        </Text>
                                                                        <Text style={{ color: '#bbbdc0', fontSize: hp('2%') }}>
                                                                            {item.email}
                                                                        </Text>
                                                                    </View>
                                                                </Left>
                                                            </View>
                                                            :
                                                            <View style={{
                                                                flexDirection: 'row',
                                                                paddingLeft: 20,
                                                                paddingRight: 20,
                                                                alignItems: 'center'
                                                            }}
                                                            >
                                                                <Left style={{ flexDirection: 'column' }}>
                                                                    <View style={{ paddingLeft: 20 }}>
                                                                        <Text style={{ color: 'black', fontSize: hp('2.5%') }}>
                                                                            {item.firstName} {item.lastName}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={{ paddingLeft: 20 }}>
                                                                        <Text style={{ color: '#bbbdc0', fontSize: hp('2%') }}>
                                                                            {item.email}
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
                                    No matching approvers.
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

export default connect(null, mapDispatchToProps)(ApproverList);