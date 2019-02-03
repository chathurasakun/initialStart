import React, { Component } from 'react';
import { Modal, View, Alert } from 'react-native';
import { Container, Header, Left, Right, Button, Text } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class ZoomPic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picArray: this.props.picArray
        }
    }

    render = () => {
        return (
            <Modal visible={true} transparent={true}>
                <ImageViewer
                    imageUrls={this.state.picArray}
                    enableSwipeDown={true}
                    onSwipeDown={() => Actions.pop()}
                />
                {/* renderHeader={() =>
                        <Header style={{ backgroundColor: '#3a5997', height: hp('10%') }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Left>
                                    <Button
                                    style={{width:hp('8%'),height:hp('8%')}} 
                                    transparent 
                                    onPress={() => Actions.pop()}>
                                        <Icons name='left' style={{ fontSize: hp('3%'), color: '#FFFFFF' }} />
                                    </Button>
                                </Left>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%'), fontWeight: 'bold' }}>Expense Image</Text>
                                </View>
                                <Right />
                            </View>
                        </Header>
                    } */}
            </Modal>
        )
    }
}

export default ZoomPic;