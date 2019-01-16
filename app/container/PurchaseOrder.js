import React, { Component } from 'react';
import { Text, View, Switch, ScrollView, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { Header, Button, Container, ListItem, Left, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';
import baseUrl from '../config/baseUrl';
import Icons from 'react-native-vector-icons/AntDesign';
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['id', 'poNumber', 'description'];
import { removeUser } from '../redux/actions/operations';
import { connect } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class PurchaseOrder extends Component {

    constructor() {
        super();
        this.state = {
            switchVar: true,
            purchaseOrderList: [],
            searchTerm: '',
            reloadPage: ''
        }
    }

    componentWillMount = () => {
        this.listener25 = EventRegister.addEventListener('reloadPoPage', (reloadPage) => {
            this.setState({
                reloadPage,
            }, () => this.getPurchaseOrderList());
        });
    }

    componentWillUnmount = () => {
        EventRegister.removeEventListener(this.listener25);
    }

    componentDidMount = () => {
        this.getPurchaseOrderList();
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

    getPurchaseOrderList = () => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetchingList: true }, () => {
                fetch(`${baseUrl.url}purchaseorder/list`, {
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
                                purchaseOrderList: responseJson.payload,
                                isFetchingList: false
                            });
                        }
                        else {
                            if (responseJson.httpStatus === 'UNAUTHORIZED') {
                                this.setState({ isFetchingList: false }, () => {
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
                                this.setState({ isFetchingList: false }, () => {
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
            })
        })
    }

    SwitchGo = (value) => {
        this.setState({
            switchVar: value
        });
    }

    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }

    goTo = (obj) => {
        if (this.props.fromCreateNew) {
            Actions.push('tabBar', { poItem: obj });
        }
        else {
            Actions.purchaseOrder2({ poItem: obj });
        }
    }

    renderListItem = (item) => {
        return (
            <ListItem onPress={() => this.goTo(item)}>
                <View style={{ flexDirection: 'row' }}>
                    <Left style={{ flexDirection: 'column' }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: hp('2%')
                            }}
                        >
                            {item.description}
                        </Text>
                        <Text style={{ color: '#9B9B9B', fontSize: hp('2%') }}>{item.poNumber}</Text>
                    </Left>
                    <Right>
                        <Icons name='right' style={{ color: '#9B9B9B', fontSize: hp('2%') }} />
                    </Right>
                </View>
            </ListItem>
        )
    }

    render = () => {
        const tmpArray = this.state.purchaseOrderList;
        const filteredList = tmpArray.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

        return (
            <Container>
                <Header style={{ backgroundColor: '#3a5997', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.dashboard() }}>
                                <Icons name='left' style={{ color: '#FFFFFF', fontSize: hp('2%') }} />
                            </Button>
                        </Left>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%'), fontWeight: 'bold' }}>Purchase Orders</Text>
                        </View>
                        <Right>
                            <Button transparent onPress={() => { Actions.push('addNewPurchaseOrder') }}>
                                <Icons name='plus' style={{ color: '#FFFFFF', fontSize: hp('2%') }} />
                            </Button>
                        </Right>
                    </View>
                </Header>

                <SearchInput
                    onChangeText={(term) => { this.searchUpdated(term) }}
                    style={{
                        borderColor: '#CCC',
                        borderWidth: 1,
                        width: wp('100%'),
                        height: hp('6%'),
                        borderRadius: 8,
                        marginTop: hp('1%'),
                        padding: hp('2%'),
                        fontSize: hp('2%')
                    }}
                    placeholder="     Start typing to search.."
                />

                <ListItem>
                    <View style={{ flexDirection: 'row' }}>
                        <Left>
                            <Text style={{ fontSize: hp('2%') }} >Show only related Purchase Orders</Text>
                        </Left>
                        <View style={{ paddingRight: hp('1%') }}>
                            <Switch
                                value={this.state.switchVar}
                                onValueChange={(value) => this.SwitchGo(value)}
                                style={{ transform: [{ scaleX: hp('0.15%') }, { scaleY: hp('0.15%') }] }}
                            />
                        </View>
                    </View>
                </ListItem>

                <View style={{ backgroundColor: '#ededed', height: hp('2%') }} />

                <ScrollView>
                    {(this.state.isFetchingList === false) ?
                        (filteredList.length !== 0) ?
                            <View style={{ flexDirection: 'column' }}>
                                {filteredList.map(item => {
                                    return (
                                        this.renderListItem(item)
                                    );
                                })}
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
                                        fontSize: hp('2.5%'),
                                    }}
                                >
                                    No matching purchase orders.
                            </Text>
                            </View>
                        :
                        <ActivityIndicator animating size='large' color='#00ff00' />
                    }
                </ScrollView>

                {(this.state.isSaving) ?
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

const mapDispatchToProps = (dispatch) => {
    return {
        removeUser: () => {
            dispatch(removeUser())
        },
    }
}

export default connect(null, mapDispatchToProps)(PurchaseOrder);