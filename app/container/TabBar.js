import React, { Component } from 'react';
import { Alert, Text, View, ActivityIndicator } from 'react-native';
import { Header, Button, Container, Tabs, Tab } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/AntDesign';
import HeaderBarStyle from './styles/TabBarStyle';
import CreateNewTimeSheet from './CreateNewTimeSheet';
import InterLabour from './InterLabour';
import InterEquip from './InterEquip';
import Expenses from './Expenses';
import InterMaterial from './InterMaterial';
import { EventRegister } from 'react-native-event-listeners';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class TabBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSavingData: false
        }
    }

    componentWillMount = () => {
        this.listener10 = EventRegister.addEventListener('myCustomEvent10', (isSavingData) => {
            this.setState({
                isSavingData,
            });
        });
    }

    componentWillUnmount = () => {
        EventRegister.removeEventListener(this.listener10);
    }

    render = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: '#3a5997', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.1 }}>
                            <Button
                                transparent
                                onPress={() => {
                                    Alert.alert(
                                        '',
                                        'Are you sure you want to discard this Timesheet?',
                                        [{
                                            text: 'Yes', onPress: () => {
                                                Actions.pop()
                                            }
                                        },
                                        {
                                            text: 'No', onPress: () => { }
                                        }],
                                    );
                                }}
                            >
                                <Icons name='left' style={{ fontSize: hp('3%'), color: '#FFFFFF' }} />
                            </Button>
                        </View>
                        <View style={{ alignItems: 'center', flex: 0.8 }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%'), fontWeight: 'bold' }}>Create new Timesheet</Text>
                        </View>
                        <View style={{ flex: 0.1 }} />
                    </View>
                </Header>

                <Tabs
                    initialPage={0}
                    tabBarUnderlineStyle={HeaderBarStyle.tabBarUnderline}
                    locked={true}
                    tabBarPosition='bottom'
                    tabBarBackgroundColor='#ffffff'
                    tabContainerStyle={{ height: hp('7.5%') }}
                >
                    <Tab heading='Sum'
                        tabStyle={HeaderBarStyle.tabHeading}
                        activeTabStyle={HeaderBarStyle.activeTabStyle}
                        textStyle={HeaderBarStyle.tabHeadingText}
                        activeTextStyle={HeaderBarStyle.activeTabHeadingText}
                    >
                        {!(this.props.fromPO2) ?
                            <CreateNewTimeSheet value={this.props.poItem} fromTabBar={true} />
                            :
                            <CreateNewTimeSheet value={this.props.po} />
                        }
                    </Tab>

                    <Tab heading='Lab'
                        tabStyle={HeaderBarStyle.tabHeading}
                        activeTabStyle={HeaderBarStyle.activeTabStyle}
                        textStyle={HeaderBarStyle.tabHeadingText}
                        activeTextStyle={HeaderBarStyle.activeTabHeadingText}
                    >
                        <InterLabour />
                    </Tab>

                    <Tab heading='Equ'
                        tabStyle={HeaderBarStyle.tabHeading}
                        activeTabStyle={HeaderBarStyle.activeTabStyle}
                        textStyle={HeaderBarStyle.tabHeadingText}
                        activeTextStyle={HeaderBarStyle.activeTabHeadingText}
                    >
                        <InterEquip />
                    </Tab>

                    <Tab heading='Mat'
                        tabStyle={HeaderBarStyle.tabHeading}
                        activeTabStyle={HeaderBarStyle.activeTabStyle}
                        textStyle={HeaderBarStyle.tabHeadingText}
                        activeTextStyle={HeaderBarStyle.activeTabHeadingText}
                    >
                        <InterMaterial />
                    </Tab>

                    <Tab heading='Exp'
                        tabStyle={HeaderBarStyle.tabHeading}
                        activeTabStyle={HeaderBarStyle.activeTabStyle}
                        textStyle={HeaderBarStyle.tabHeadingText}
                        activeTextStyle={HeaderBarStyle.activeTabHeadingText}
                    >
                        <Expenses />
                    </Tab>
                </Tabs>

                <View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ededed',
                    marginTop: hp('92.5%'),
                    height: 2
                }} />

                {(this.state.isSavingData) ?
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
                    :
                    null
                }
            </Container>
        );
    }
}

export default TabBar;