import React, { Component } from 'react';
import { Text, View, FlatList, Alert } from 'react-native';
import { Button, Container, SwipeRow, Icon, CardItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { EventRegister } from 'react-native-event-listeners';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class Expenses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expenseList: []
        }
    }

    renderExpenseList = () => {
        return (
            (this.state.expenseList.length > 0) ?
                <FlatList
                    data={this.state.expenseList}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => this.renderListItem(item)}
                    extraData={this.state}
                    ListHeaderComponent={() => {
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
                            fontSize: hp('2.5%')
                        }}
                    >
                        Click Add Expense to select expense.
                    </Text>
                </View>
        )
    }

    renderListItem = (item) => {
        return (
            <SwipeRow
                rightOpenValue={-60}
                body={
                    <CardItem>
                        <View style={{ flexDirection: 'column', height: hp('8%') }}>
                            <View style={{ paddingLeft: 1 }}>
                                <Text style={{ fontSize: hp('2%') }} numberOfLines={2}>{item.description}</Text>
                            </View>
                            <View style={{ paddingLeft: 1, paddingTop: 10 }}>
                                <Text style={{ fontSize: hp('2%'), color: 'grey' }}>{item.amount} CAD</Text>
                            </View>
                        </View>
                    </CardItem>
                }
                right={
                    <Button danger onPress={() => {
                        Alert.alert(
                            'Warning',
                            'Are you sure?',
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        let existingExpenses = this.state.expenseList.slice();
                                        existingExpenses = existingExpenses.filter((existingItem) => existingItem !== item);
                                        this.setState({
                                            expenseList: existingExpenses
                                        }, () => EventRegister.emit('myCustomEvent6', item));
                                    }
                                },
                                { text: 'Cancel', onPress: () => { } }
                            ],
                        );
                    }}
                    >
                        <Icon active name="trash" />
                    </Button>
                }
            />
        );
    }

    render = () => {
        return (
            <Container>
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        style={{
                            alignSelf: 'flex-end',
                            width: wp('99%'),
                            height: hp('7%'),
                            backgroundColor: '#008b00',
                            justifyContent: 'center',
                            borderRadius: wp('4%'),
                            marginHorizontal: 4,
                            marginTop: hp('0.5%')
                        }}
                        onPress={() => Actions.push('expenses_2', { parentComponent6: this })}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: hp('2.5%'),
                                fontWeight: 'normal',
                                textAlign: 'center'
                            }}
                        >
                            Add Expense
                        </Text>
                    </Button>
                </View>

                <View style={{ padding: hp('1%') }} />

                {this.renderExpenseList()}

            </Container>
        );
    }
}

export default Expenses;