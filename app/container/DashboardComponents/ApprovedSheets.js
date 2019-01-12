import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Container, Right, Left } from 'native-base';
import Icons from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class ApprovedSheets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pendingSheets: this.props.timesheet
        }
    }

    setColor = (status) => {
        if (status === 4)
            return (color = '#008B02');
        else if (status === 3)
            return (color = '#F5A623');
        else if (status === 5)
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

    renderListItem = (item) => {
        let monthName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        let getDate = new Date(item.timesheetDate);
        let getYear = getDate.getFullYear().toString();
        let getMonth = getDate.getMonth().toString();
        let getDay = getDate.getDate().toString();

        return (
            <TouchableOpacity>
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
                        <Text style={{ textAlign: 'center', fontSize: hp('2.5%') }}>{monthName[getMonth] + "-" + getDay + "-" + getYear}</Text>
                        <Text style={{ textAlign: 'center', fontSize: hp('2%'), color: '#9B9B9B' }}>{item.poNumber}</Text>
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
                <FlatList
                    data={this.state.pendingSheets}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => this.renderListItem(item)}
                    ListFooterComponent={() => {
                        return (<View style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }} />)
                    }}
                />
            </Container>
        )
    }
}

export default ApprovedSheets;