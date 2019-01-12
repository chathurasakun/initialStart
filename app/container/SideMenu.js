import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, SectionList, AsyncStorage } from 'react-native';
import FastImage from 'react-native-fast-image';
import DrawerCell from './DrawerCell';
import Images from '../utils/images';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { removeUser } from '../redux/actions/operations';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class SideMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userTypeData: this.props.userDetails[0]
        }
    };

    async logout() {
        try {
            await AsyncStorage.removeItem('key');
            await AsyncStorage.removeItem('userObj');
            this.props.removeUser();
            Actions.login();
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    dashboard = () => {
        Actions.dashboard();
    }

    purchaseOrder = () => {
        Actions.purchaseOrder();
    }

    returnSideMenuList = () => {
        let sections;
        if (this.state.userTypeData.userRoleDTO.name === 'SUPERVISOR') {
            sections = [{
                key: "personal", data: [
                    { action: this.dashboard, icon: Images.home, title: "Dashboard", key: "0" },
                    { action: this.purchaseOrder, icon: Images.VolunteerActivity, title: "Purchase Orders", key: "1" },
                ]
            },
            {
                key: "logout", data: [
                    { action: this.logout, icon: Images.logout, title: "Logout", key: "0" },
                ]
            }];
        }
        else {
            sections = [{
                key: "personal", data: [
                    { action: this.dashboard, icon: Images.home, title: "Dashboard", key: "0" },
                ]
            },
            {
                key: "logout", data: [
                    { action: this.logout, icon: Images.logout, title: "Logout", key: "0" },
                ]
            }];
        }
        return sections;
    }

    render = () => {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.detailContainer}>
                            <FastImage style={styles.profilePicture} source={{ uri: 'https://unsplash.it/400/400?image=1' }} />
                            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)', marginLeft: 20 }}>
                                <Text numberOfLines={0} style={[styles.navHeaderName]}>{this.state.userTypeData.firstName} {this.state.userTypeData.lastName}</Text>
                                <Text numberOfLines={0} style={[styles.navHeaderEmail]}>{this.state.userTypeData.contractorDTO.companyName}</Text>
                                <Text numberOfLines={0} style={[styles.navHeaderUserRole]}>[{this.state.userTypeData.userRoleDTO.name}]</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <SectionList
                            sections={this.returnSideMenuList()}
                            renderItem={({ item }) =>
                                <DrawerCell
                                    icon={item.icon}
                                    title={item.title}
                                    action={item.action.bind(this)}
                                />
                            }
                            renderSectionHeader={({ section }) =>
                                section.key !== "personal" ?
                                    <View style={{ flex: 1, height: 0.4, backgroundColor: "#DFDFDF" }} />
                                    :
                                    null
                            }
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: hp('12%'),
        backgroundColor: '#f5f5f5',
    },
    detailContainer: {
        position: 'absolute',
        bottom: hp('0.2%'),
        left: wp('3%'),
        flexDirection: 'row',
    },
    profilePicture: {
        width: hp('8%'),
        height: hp('8%'),
        borderRadius: hp('8%') / 2
    },
    navHeaderName: {
        fontSize: hp('3%'),
        color: 'black',
        marginRight: 72,
    },
    navHeaderEmail: {
        fontSize: hp('2%'),
        color: 'black',
        marginRight: 72,

    },
    navHeaderUserRole: {
        fontSize: hp('2%'),
        color: 'grey',
        marginRight: 72,
    }
});

const mapStateToProps = (state) => {
    return {
        userDetails: state.userDetails.userData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeUser: () => {
            dispatch(removeUser())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
