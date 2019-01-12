import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class DrawerCell extends Component {

    static propTypes = {
        icon: PropTypes.number,
        action: PropTypes.func,
        title: PropTypes.string,
        iconColor: PropTypes.string
    }

    render = () => {
        return (
            <TouchableOpacity onPress={this.props.action}>
                <View style={{ height: hp('7%'), flex: 1, alignItems: "center", flexDirection: "row" }}>
                    <View style={{ left: wp('3%'), flexDirection: "row", flex: 1 }}>
                        <Image source={this.props.icon} style={{ width: wp('5%'), height: wp('5%'), tintColor: this.props.iconColor }} />

                        <View style={{ left: wp('4%'), alignItems: "center" }}>
                            <Text style={{ fontSize: hp('2%') }}>{this.props.title}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default DrawerCell