import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Container, Right, Left } from 'native-base';
import Icons from 'react-native-vector-icons/AntDesign';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class PendingSheets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pendingSheets: this.props.timesheet
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
        );
    }

    // renderListItem = (item) => {
    //     let monthName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    //         "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    //     let getDate = new Date(item.timesheetDate);
    //     let getYear = getDate.getFullYear().toString();
    //     let getMonth = getDate.getMonth().toString();
    //     let getDay = getDate.getDate().toString();

    //     return (
    //         <TouchableOpacity onPress={() => Actions.push('viewTimesheetForm', { timesheetId: item.id, status: item.status })}>
    //             <View
    //                 style={{
    //                     flexDirection: 'row',
    //                     borderBottomColor: '#78909C',
    //                     borderTopColor: '#78909C',
    //                     height: hp('8%'),
    //                     borderTopWidth: 1,
    //                     backgroundColor: '#FFFFFF'
    //                 }}
    //             >
    //                 <Left style={{ paddingLeft: wp('3%') }}>
    //                     <Text style={{ textAlign: 'center', fontSize: hp('2.5%') }}>{monthName[getMonth] + "-" + getDay + "-" + getYear}</Text>
    //                     <Text style={{ textAlign: 'center', fontSize: hp('2%'), color: '#9B9B9B' }}>{item.poNumber}</Text>
    //                 </Left>
    //                 <Right style={{ flexDirection: 'row', flex: 0 }}>
    //                     <View>
    //                         <Text style={{ textAlign: 'center', color: this.setColor(item.status), fontWeight: 'bold', fontSize: hp('2%') }}>{this.setType(item.status)}</Text>
    //                     </View>
    //                     <Icons name="right" style={{ color: '#9B9B9B', fontSize: hp('2%') }} />
    //                 </Right>
    //             </View>
    //         </TouchableOpacity>
    //     );
    // }

    render = () => {
        return (
            <Container>
                {(this.state.pendingSheets.length > 0) ?
                    <FlatList
                        data={this.state.pendingSheets}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item }) => this.renderListItem(item)}
                        scrollEnabled={false}
                        ListFooterComponent={() => {
                            return (<View style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }} />)
                        }}
                    />
                    :
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: '#9B9B9B',
                                fontSize: hp('2.5%'),
                            }}
                        >
                            No pending timesheets.
                        </Text>
                    </View>
                }
            </Container>
        )
    }
}

export default PendingSheets;