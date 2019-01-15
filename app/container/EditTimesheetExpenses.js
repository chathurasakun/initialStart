import React, { Component } from 'react';
import { Text, View, FlatList, Alert } from 'react-native';
import { Button, Container, SwipeRow, Icon, CardItem, Header, Left, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/AntDesign';
import Icons2 from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class EditTimesheetExpenses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expenseList: this.props.parentComponent.state.expenseArray
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

    contains = (arr, valueOrObject) => {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === valueOrObject) {
                return true;
            }
        }
        return false;
    }

    renderListItem = (item) => {
        return (
            <SwipeRow
                leftOpenValue={60}
                rightOpenValue={-60}
                left={
                    <Button success onPress={() => Actions.push('editTimesheetExpenses_2', { parentComponent6: this, addNew: false, expenseItem: item })}>
                        <Icons2 name='edit' style={{ color: '#FFFFFF', fontSize: hp('2%') }} />
                    </Button>
                }
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
                    <Button
                        danger
                        onPress={() => {
                            Alert.alert(
                                'Warning',
                                'Are you sure?',
                                [
                                    {
                                        text: 'OK', onPress: () => {
                                            let fromServerExpenses = this.props.parentComponent.state.fromServerExpense;
                                            let expenseIds = this.props.parentComponent.state.expenseIds;

                                            if (!this.contains(expenseIds, item)) {
                                                fromServerExpenses = fromServerExpenses.filter((existItem) => existItem !== item);
                                            }
                                            for (let i in fromServerExpenses) {
                                                if (fromServerExpenses[i].id === item.id) {
                                                    for (let i in expenseIds) {
                                                        if (expenseIds[i].id === item.id)
                                                            fromServerExpenses[i].status = '6';
                                                    }
                                                }
                                            }

                                            let existingExpenses = this.state.expenseList.slice();
                                            existingExpenses = existingExpenses.filter((existingItem) => existingItem !== item);
                                            this.setState({
                                                expenseList: existingExpenses
                                            }, () => this.props.parentComponent.setState({
                                                expenseArray: existingExpenses,
                                                fromServerExpense: fromServerExpenses
                                            }));
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
                <Header style={{ backgroundColor: '#007CC4', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icons name='left' style={{ color: '#FFFFFF', fontSize: hp('2%') }} />
                            </Button>
                        </Left>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Expenses</Text>
                        </View>
                        <Right />
                    </View>
                </Header>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Button
                        style={{
                            width: wp('95%'),
                            height: hp('7%'),
                            backgroundColor: '#00a65a',
                            justifyContent: 'center',
                            borderRadius: wp('4%'),
                            marginTop: hp('0.5%')
                        }}
                        onPress={() => Actions.push('editTimesheetExpenses_2', { parentComponent6: this, addNew: true, expenseItem: { description: '', amount: '', expensesImageDTOs: [], id: '' } })}
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

export default EditTimesheetExpenses;