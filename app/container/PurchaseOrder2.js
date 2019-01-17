import React, { Component } from 'react';
import { AsyncStorage, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { Header, Button, Container, List, ListItem, Left, Right, Card, CardItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
import baseUrl from '../config/baseUrl';
import Icons from 'react-native-vector-icons/AntDesign';
import { removeUser } from '../redux/actions/operations';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class PurchaseOrder2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            existingSheet: [],
            poNumber: ''
        }
    }

    componentDidMount = () => {
        this.getExistingTimesheetHistory(this.props.poItem.id);
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

    getExistingTimesheetHistory = (pid) => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingTimesheet: true }, () => {
                fetch(`${baseUrl.url}purchaseorder/${pid}`, {
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
                                existingSheet: responseJson.payload.timeSheetDTOs,
                                poNumber: responseJson.payload.poNumber,
                                isFetchingTimesheet: false
                            });
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isFetchingTimesheet: false }, () => {
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
                                this.setState({ isFetchingTimesheet: false }, () => {
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

    renderListItem = (item) => {
        let monthName = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let dayEndStr = ['', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
            'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st']

        let getDate = new Date(item.timesheetDate);
        let getYear = getDate.getFullYear().toString();
        let getMonth = getDate.getMonth().toString();
        let getDay = getDate.getDate().toString();
        let getDayName = getDate.getDay();

        return (
            (item.status === 3 || item.status === 4 || item.status === 5) ?
                <TouchableOpacity onPress={() => Actions.push('viewTimesheetForm', { timesheetId: item.id, timesheetStatus: item.status })}>
                    <View
                        style={{
                            flexDirection: 'row',
                            borderBottomColor: '#78909C',
                            borderTopColor: '#78909C',
                            height: hp('12%'),
                            borderTopWidth: 1,
                            backgroundColor: '#FFFFFF',
                            alignItems: 'center'
                        }}
                    >
                        <View style={{ flex: 0.9 }}>
                            <Text style={{ fontSize: hp('2.5%'), color: '#484848', paddingLeft: hp('2%') }}>{days[getDayName] + " " + monthName[getMonth] + " " + getDay + dayEndStr[getDay] + ", " + getYear}</Text>
                            <View style={{ flexDirection: 'row', paddingLeft: hp('2%'), marginTop: hp('0.5%') }}>
                                <View style={{ flex: 0.7 }}>
                                    <Text style={{ fontSize: hp('2.7%'), color: '#bbbdc0', fontWeight: 'bold' }}>{this.state.poNumber}</Text>
                                </View>
                                <View
                                    style={{
                                        marginRight: hp('5%'),
                                        backgroundColor: this.setColor(item.status),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: hp('3%'),
                                        borderRadius: hp('0.7%'),
                                        flex: 0.3
                                    }}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: hp('1.7%') }}>{this.setType(item.status)}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 0.1 }}>
                            <Icons name="right" style={{ color: '#484848', fontSize: hp('3.3%') }} />
                        </View>
                    </View>
                </TouchableOpacity>
                :
                null
        );
    }

    render = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: '#3a5997', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.purchaseOrder() }} >
                                <Icons name='left' style={{ color: '#FFFFFF', fontSize: hp('3%') }} />
                            </Button>
                        </Left>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%'), fontWeight: 'bold' }}>Purchase Orders</Text>
                        </View>
                        <Right />
                    </View>
                </Header>

                <Card>
                    <CardItem header>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: hp('2%'),
                                        textAlign: 'left',
                                        color: '#484848'
                                    }}
                                >
                                    {this.props.poItem.description}
                                </Text>
                                <Text style={{ color: '#9B9B9B', fontSize: hp('2%'), fontWeight: 'bold' }}>{this.props.poItem.poNumber}</Text>
                            </View>
                        </View>
                    </CardItem>
                    <CardItem>
                        <View style={{ flexDirection: 'column' }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: hp('2%'),
                                    textAlign: 'left',
                                    color: '#484848'
                                }}
                            >
                                Agreement
                            </Text>
                            <Text style={{ color: '#9B9B9B', textAlign: 'left', fontSize: hp('2%'), fontWeight: 'bold' }}>{this.props.poItem.agreementDTO.agreementNumber}</Text>
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
                                            textAlign: 'left',
                                            color: '#484848'
                                        }}
                                    >
                                        Work Order
                                </Text>
                                    <Text style={{ color: '#9B9B9B', textAlign: 'left', fontSize: hp('2%'), fontWeight: 'bold' }}>{this.props.poItem.costObjectNumber}</Text>
                                </View>
                            </Left>
                            <Right>
                                <Text style={{ color: '#7ED321', fontSize: hp('1.5%'), }}>{this.props.poItem.costObjectType}</Text>
                            </Right>
                        </View>
                    </CardItem>
                </Card>

                <Card>
                    <View
                        style={{
                            marginRight: wp('15%'),
                            marginLeft: wp('15%'),
                            marginTop: hp('2%'),
                            alignItems: 'center'
                        }}
                    >
                        <Button
                            bordered
                            style={{
                                height: hp('7%'),
                                justifyContent: 'center',
                                marginBottom: hp('2%'),
                                width: wp('70%'),
                                borderRadius: wp('2%'),
                                backgroundColor: '#FFFFFF'
                            }}
                            onPress={() => Actions.push('tabBar', { po: this.props.poItem, fromPO2: true })}
                        >
                            <Text
                                style={{
                                    color: '#007CC4',
                                    fontWeight: '500',
                                    fontSize: hp('2.7%')
                                }}
                            >
                                Create New Timesheet
                        </Text>
                        </Button>
                    </View>
                </Card>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: hp('4%'), color: '#484848' }}>Existing Timesheets</Text>
                </View>

                {(this.state.isFetchingTimesheet === false) ?
                    (this.state.existingSheet.length > 0) ?
                        <FlatList
                            data={this.state.existingSheet}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item }) => this.renderListItem(item)}
                            ListFooterComponent={() => {
                                return (<View style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }} />)
                            }}
                        />
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
                                    fontSize: hp('2.5%'),
                                }}
                            >
                                No existing Timesheets.
                            </Text>
                        </View>
                    :
                    <ActivityIndicator animating size='large' color='#00ff00' />
                }
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

export default connect(null, mapDispatchToProps)(PurchaseOrder2);