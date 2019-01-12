import React, { Component } from 'react';
import { AsyncStorage, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { Header, Button, Container, List, ListItem, Left, Right, Card, CardItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Metrics from '../utils/matrics';
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
            return (color = '#008B02');
        else if (status === 3)
            return (color = '#F5A623');
        else
            return (color = '#C6283A');
    }

    setType = (status) => {
        if (status === 4)
            return 'Approved';
        else if (status === 3)
            return 'Pending';
        else
            return 'Rejected';
    }

    renderListItem = (item) => {
        let getDate = new Date(item.created);
        let getYear = getDate.getFullYear().toString();
        let getMonth = getDate.getMonth().toString();
        let getDay = getDate.getDate().toString();

        return (
            <TouchableOpacity onPress={() => Actions.push('viewTimesheetForm', { timesheetId: item.id, timesheetStatus: item.status })}>
                <View
                    style={{
                        flexDirection: 'row',
                        borderBottomColor: '#78909C',
                        borderTopColor: '#78909C',
                        height: hp('8%'),
                        borderTopWidth: 1,
                        backgroundColor: '#FFFFFF'
                    }}
                >
                    <Left style={{ paddingLeft: wp('3%') }}>
                        <Text style={{ textAlign: 'center', fontSize: hp('2.5%') }}>{getYear + "/" + getMonth + "/" + getDay}</Text>
                        <Text style={{ textAlign: 'center', fontSize: hp('2%'), color: '#9B9B9B' }}>{this.state.poNumber}</Text>
                    </Left>
                    <Right style={{ flexDirection: 'row', flex: 0 }}>
                        <View>
                            <Text style={{ textAlign: 'center', color: this.setColor(item.status), fontWeight: 'bold', fontSize: hp('2%') }}>{this.setType(item.status)}</Text>
                        </View>
                        <Icons name="right" style={{ color: '#9B9B9B', fontSize: hp('2%') }} />
                    </Right>
                </View>
            </TouchableOpacity>
        );
    }

    render = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: '#021aee', height: hp('7.5%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.purchaseOrder() }} >
                                <Icons name='left' style={{ color: '#FFFFFF', fontSize: hp('2%') }} />
                            </Button>
                        </Left>
                        <View style={{ width: (Metrics.screenWidth / 4) * 2, alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%'), fontWeight: 'bold' }}>Purchase Orders</Text>
                        </View>
                        <Right ></Right>
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
                                        textAlign: 'left'
                                    }}
                                >
                                    {this.props.poItem.description}
                                </Text>
                                <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{this.props.poItem.poNumber}</Text>
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
                            <Text style={{ color: '#9B9B9B', textAlign: 'left', fontSize: hp('2%') }}>{this.props.poItem.agreementDTO.agreementNumber}</Text>
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
                                    <Text style={{ color: '#9B9B9B', textAlign: 'left', fontSize: hp('2%') }}>{this.props.poItem.costObjectNumber}</Text>
                                </View>
                            </Left>
                            <Right>
                                <Text style={{ color: '#7ED321', fontSize: hp('1.5%'), }}>{this.props.poItem.costObjectType}</Text>
                            </Right>
                        </View>
                    </CardItem>
                </Card>

                <View style={{ backgroundColor: '#ededed', height: hp('2%') }} />

                <List>
                    <ListItem onPress={() => Actions.push('tabBar', { po: this.props.poItem, fromPO2: true })} >
                        <View style={{ flexDirection: 'row' }}>
                            <Left>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: hp('2%')
                                    }}
                                >
                                    Create New Timesheet
                                </Text>
                            </Left>
                            <Right>
                                <Icons name='right' style={{ color: '#9B9B9B', fontSize: hp('2%') }} />
                            </Right>
                        </View>
                    </ListItem>

                    <ListItem itemDivider>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: hp('2%')
                            }}
                        >
                            Existing Timesheets
                        </Text>
                    </ListItem>
                </List>

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