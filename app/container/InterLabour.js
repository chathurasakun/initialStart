import React, { Component } from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Button, Container, Right, Left, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class InterLabour extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedValues: []
        };
    }

    renderSelectedList = () => {
        return (
            (this.state.selectedValues.length > 0) ?
                <FlatList
                    data={this.state.selectedValues}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => this.renderListItem(item)}
                    extraData={this.state}
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
                        Click Add Labor to select workers.
                    </Text>
                </View>
        );
    }

    renderListItem = (item) => {
        return (
            <TouchableOpacity>
                <View
                    style={{
                        width: wp('100%'),
                        height: hp('8%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: '#9B9B9B',
                        borderWidth: 0.5
                    }}
                >
                    {(item.selected) ?
                        <View
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                alignItems: 'center',
                                paddingLeft: 20,
                                paddingRight: 20,
                                flexDirection: 'row',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            <Left style={{ flexDirection: 'row' }}>
                                <Icon name='checkbox' style={{ color: 'white', fontSize: hp('3.5%') }} />
                                <View style={{ flexDirection: 'column', paddingLeft: 20 }}>
                                    <Text style={{ color: 'white', fontSize: hp('2.5%') }}>
                                        {item.firstName} {item.lastName}
                                    </Text>
                                    <Text style={{ color: 'white', fontSize: hp('2%') }}>
                                        {item.skillDTO.skillName}
                                    </Text>
                                </View>
                            </Left>
                            <Right>
                                {(item.hours > 1) ?
                                    (item.minutes > 0) ?
                                        <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                            {item.hours} hrs {item.minutes} min
                                        </Text>
                                        :
                                        <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                            {item.hours} hrs 0 min
                                        </Text>
                                    :
                                    (item.minutes > 0) ?
                                        <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                            {item.hours} hr {item.minutes} min
                                        </Text>
                                        :
                                        <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                            {item.hours} hr 0 min
                                        </Text>
                                }
                            </Right>
                        </View>
                        :
                        null
                    }
                </View>
            </TouchableOpacity>
        )
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
                        onPress={() => Actions.push('labourList', { parentComponent: this })}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: hp('2.5%'),
                                fontWeight: 'normal',
                                textAlign: 'center'
                            }}
                        >
                            Add Labor
                        </Text>
                    </Button>
                </View>

                <View style={{ padding: hp('1%') }} />

                {this.renderSelectedList()}

            </Container>
        );
    }
}

export default connect(null, null)(InterLabour);