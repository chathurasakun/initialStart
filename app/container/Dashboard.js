import React, { Component } from 'react';
import { Text, View, FlatList, AsyncStorage, Alert, ActivityIndicator, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Container, Tabs, Tab, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './styles/DashboardStyle';
import baseUrl from '../config/baseUrl';
import Icons from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { updateUser, removeUser } from '../redux/actions/operations';
import ApprovedSheets from './DashboardComponents/ApprovedSheets';
import PendingSheets from './DashboardComponents/PendingSheets';
import { EventRegister } from 'react-native-event-listeners';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supervisorTimesheet: [],
            userRole: '',
            approvedTimesheet: [],
            rejectedTimesheet: [],
            pendingTimesheet: [],
            reloadPage: ''
        }
    }

    componentDidMount = () => {
        this.getUserDetails();
    }

    componentWillMount = () => {
        this.listener = EventRegister.addEventListener('reloadDashboard', (reloadPage) => {
            this.setState({
                reloadPage,
            }, () => this.getExistingTimesheets());
        });
    }

    componentWillUnmount = () => {
        EventRegister.removeEventListener(this.listener);
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

    _onRefresh() {
        this.getUserDetails();
    }

    getUserDetails = () => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingUser: true }, () => {
                fetch(`${baseUrl.url}user`, {
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
                            this.props.updateUser(responseJson.payload);
                            this.setState({
                                userRole: responseJson.payload.userRoleDTO.name,
                                isFetchingUser: false
                            }, () => this.getExistingTimesheets());
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isFetchingUser: false }, () => {
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
                                this.setState({ isFetchingUser: false }, () => {
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

    getExistingTimesheets = () => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingTimesheet: true }, () => {
                fetch(`${baseUrl.url}dashboard`, {
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
                                supervisorTimesheet: responseJson.payload.timeSheetDTOs,
                                approvedTimesheet: responseJson.payload.approvedDTOs,
                                rejectedTimesheet: responseJson.payload.rejectedDTOs,
                                pendingTimesheet: responseJson.payload.pendingDTOs,
                                isFetchingTimesheet: false
                            });
                        }
                        else
                            this.setState({ isFetchingTimesheet: false });
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
                                    <Text style={{ fontSize: hp('2.7%'), color: '#bbbdc0', fontWeight: 'bold' }}>{item.poNumber}</Text>
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
                <ScrollView
                    refreshControl={<RefreshControl
                        refreshing={this.state.isFetchingTimesheet && this.state.isFetchingUser}
                        onRefresh={this._onRefresh.bind(this)} />}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            backgroundColor: '#ECEFF1',
                            height: hp('100%')
                        }}
                    >
                        {(this.state.isFetchingTimesheet === false && this.state.isFetchingUser === false) ?
                            (this.state.userRole === 'SUPERVISOR') ?
                                <View>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            marginRight: wp('15%'),
                                            marginLeft: wp('15%'),
                                            top: hp('2%'),
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Button style={[styles.buttonContainer, styles.button1]} onPress={() => Actions.purchseDetail({ fromCreateNew: true })}>
                                            <Text style={styles.text1}>Create New Timesheet</Text>
                                        </Button>

                                        <Button bordered style={[styles.secondButtonContainer, styles.button2]} onPress={() => Actions.purchseDetail({ fromCreateNew: false })}>
                                            <Text style={styles.text2}>View Timesheet History</Text>
                                        </Button>
                                    </View>

                                    <View style={{ marginTop: hp('22%'), alignItems: 'center' }}>
                                        <Text style={{ fontSize: hp('4%'), color: '#484848' }}>Existing Timesheets</Text>
                                    </View>

                                    <View style={[styles.listContainer]}>
                                        <FlatList
                                            data={this.state.supervisorTimesheet}
                                            keyExtractor={(item, index) => item.id}
                                            renderItem={({ item }) => this.renderListItem(item)}
                                            scrollEnabled={false}
                                            ListFooterComponent={() => {
                                                return (<View style={{ borderTopColor: '#d1d2d4', borderTopWidth: 1 }} />)
                                            }}
                                        />
                                    </View>
                                </View>
                                :
                                <View
                                    style={{
                                        height: hp('100%'),
                                        marginTop: hp('3%'),
                                        padding: wp('3%')
                                    }}
                                >
                                    <Tabs
                                        initialPage={0}
                                        tabBarUnderlineStyle={styles.tabBarUnderline}
                                        locked={true}
                                    >
                                        <Tab heading='Pending'
                                            tabStyle={styles.tabHeading}
                                            activeTabStyle={styles.activeTabStyle}
                                            textStyle={styles.tabHeadingText}
                                            activeTextStyle={styles.activeTabHeadingText}
                                        >
                                            <PendingSheets timesheet={this.state.pendingTimesheet} />
                                        </Tab>

                                        <Tab heading='Approved'
                                            tabStyle={styles.tabHeading}
                                            activeTabStyle={styles.activeTabStyle}
                                            textStyle={styles.tabHeadingText}
                                            activeTextStyle={styles.activeTabHeadingText}
                                        >
                                            <ApprovedSheets timesheet={this.state.approvedTimesheet} />
                                        </Tab>

                                        <Tab heading='Rejected'
                                            tabStyle={styles.tabHeading}
                                            activeTabStyle={styles.activeTabStyle}
                                            textStyle={styles.tabHeadingText}
                                            activeTextStyle={styles.activeTabHeadingText}
                                        >
                                            <ApprovedSheets timesheet={this.state.rejectedTimesheet} />
                                        </Tab>
                                    </Tabs>
                                </View>
                            :
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
                        }
                    </View>
                </ScrollView>
            </Container>
        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (user) => {
            dispatch(updateUser(user))
        },
        removeUser: () => {
            dispatch(removeUser())
        },
    }
}

export default connect(null, mapDispatchToProps)(Dashboard);