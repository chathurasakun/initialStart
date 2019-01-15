import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Dimensions, FlatList } from 'react-native';
import { Button, Container, Right, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class InterMaterial extends Component {
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
                        Click Add Material to select material.
                    </Text>
                </View>
        )
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
                            <Icon name='checkbox' style={{ color: 'white', fontSize: hp('3.5%') }} />
                            <View style={{ paddingLeft: 20, flexDirection: 'column' }}>
                                <Text style={{ color: 'white', fontSize: hp('2.5%') }}>
                                    {item.materialName}
                                </Text>
                            </View>
                            <Right>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: hp('2%') }}>
                                    {item.quantity + item.halfValue} {item.measurement}
                                </Text>
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
                        onPress={() => Actions.push('materialList', { parentComponent4: this })}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: hp('2.5%'),
                                fontWeight: 'normal',
                                textAlign: 'center'
                            }}
                        >
                            Add Material
                        </Text>
                    </Button>
                </View>

                <View style={{ padding: hp('1%') }} />

                {this.renderSelectedList()}

            </Container>
        );
    }
}

export default connect(null, null)(InterMaterial);