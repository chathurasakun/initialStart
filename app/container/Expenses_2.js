import React, { Component } from 'react';
import { Text, View, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Header, Button, Container, Left, Right, Icon, Textarea, Item, Input } from 'native-base';
import Metrics from '../utils/matrics';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker';
import { EventRegister } from 'react-native-event-listeners';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const options = {
    title: 'Please Select One',
    takePhotoButtonTitle: 'Take photo with your camera',
    chooseFromLibraryButtonTitle: 'choose photo from library',
}

class Expenses_2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            description: '',
            amount: '',
            expenseData: []
        };
    }

    componentDidMount = () => {
        this.setState({
            expenseData: this.props.parentComponent6.state.expenseList
        });
    }

    addTo = () => {
        if (this.state.amount !== '' && this.state.description !== '' && this.state.images.length !== 0) {
            let expenseArray = this.state.expenseData.slice();

            const expenseObj = {
                id: Math.random(),
                images: this.state.images,
                amount: this.state.amount,
                description: this.state.description
            }
            expenseArray.push(expenseObj);
            this.props.parentComponent6.setState({
                expenseList: expenseArray
            }, () => EventRegister.emit('myCustomEvent5', expenseObj));

            Actions.pop();
        }
        else {
            Alert.alert(
                '',
                'Please add description,amount and atleast one image per expense!',
                [
                    {
                        text: 'Ok',
                        onPress: console.log('ok pressesd'),
                    },
                ],
                { cancelable: false }
            );
        }
    }

    showImagePicker = () => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                images = this.state.images.slice();
                images.push(response);
                this.setState({
                    images: images
                });
            }
        });
    }

    getUploadImageSreenWidthHeight = () => {
        const screenWidth = Metrics.screenWidth;
        const imageWidth = (screenWidth) - 32;
        const imageHeight = (screenWidth) - 180;
        return { width: imageWidth, height: imageHeight };
    }

    render = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: '#3a5997', height: hp('10%') }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Left>
                            <Button transparent onPress={() => { Actions.pop() }}>
                                <Icons name='left' style={{ fontSize: hp('3%'), color: '#FFFFFF' }} />
                            </Button>
                        </Left>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: hp('2.5%') }}>Add Expense</Text>
                        </View>
                        <Right>
                            <Button transparent onPress={() => this.addTo()} >
                                <Text style={{ color: '#FFFFFF', fontSize: hp('2%') }}>Add</Text>
                            </Button>
                        </Right>
                    </View>
                </Header>

                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ paddingLeft: 10, paddingTop: 20 }}>
                            <Text style={{ fontSize: hp('2.5%') }}>Description</Text>
                        </View>
                        <View style={{ padding: 10, paddingTop: 5 }}>
                            <Textarea
                                rowSpan={5}
                                bordered
                                placeholder='Add description'
                                onChangeText={(desc) => this.setState({
                                    description: desc
                                })}
                                style={{ height: hp('15%'), fontSize: hp('2%') }}
                            />
                        </View>

                        <View style={{ padding: hp('1%') }} />

                        <View style={{ flexDirection: 'row' }}>
                            <Left style={{ paddingLeft: 10 }}>
                                <Text style={{ fontSize: hp('2.5%') }}>Amount</Text>
                            </Left>
                            <Right style={{ paddingRight: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: hp('2%') }}>CAD </Text>
                                    <Item regular style={{ width: hp('10%'), height: hp('4%') }}>
                                        <Input
                                            onChangeText={(amount) => this.setState({
                                                amount: amount
                                            })}
                                            maxLength={7}
                                            style={{ fontSize: hp('2%') }}
                                        />
                                    </Item>
                                </View>
                            </Right>
                        </View>

                        <View style={{ padding: hp('1%') }} />

                        <View style={{ flexDirection: 'row' }}>
                            <Left style={{ paddingLeft: 10 }}>
                                <Text style={{ fontSize: hp('2.5%') }}>Add Image</Text>
                            </Left>
                            <Right style={{ paddingRight: 10 }}>
                                <Button transparent={true} style={{ backgroundColor: '#008b00', height: hp('4.9%') }} onPress={() => this.showImagePicker()} disabled={(this.state.images.length === 3) ? true : false}>
                                    <Icon name="md-camera" style={{ color: '#FFFFFF', fontSize: hp('3%') }} />
                                </Button>
                            </Right>
                        </View>

                        <View style={{ padding: hp('1%') }} />

                        <View
                            style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                paddingTop: 20
                            }}
                        >
                            <View style={{ flexDirection: 'column' }}>
                                {this.state.images.map((image) => {
                                    return (
                                        <View style={{ width: this.getUploadImageSreenWidthHeight().width, height: this.getUploadImageSreenWidthHeight().height, backgroundColor: "#ABABAB", alignItems: "center", justifyContent: "center", margin: 8 }}>
                                            <TouchableOpacity style={{ position: "absolute", right: -8, zIndex: 100, top: -8, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.5)", width: 24, height: 24, justifyContent: "center" }}
                                                onPress={() => {
                                                    let images = this.state.images.slice();
                                                    images = images.filter((existItem) => existItem !== image);
                                                    this.setState({ images: images });
                                                }}
                                            >
                                                <Icon name="md-close" style={{ color: '#FFFFFF', alignSelf: "center", fontSize: 16 }} />
                                            </TouchableOpacity>
                                            <Image
                                                style={{ width: this.getUploadImageSreenWidthHeight().width, height: this.getUploadImageSreenWidthHeight().height }}
                                                source={{ uri: image.uri }}
                                            />
                                        </View>
                                    )
                                })}

                                {this.state.images.length !== 3 ?
                                    <View style={{ width: this.getUploadImageSreenWidthHeight().width, height: this.getUploadImageSreenWidthHeight().height, backgroundColor: "#ABABAB", alignItems: "center", justifyContent: "center", margin: 8 }}>
                                        <Button transparent={true} style={{ alignSelf: "center" }} onPress={() => this.showImagePicker()}>
                                            <Icon name="md-camera" style={{ color: '#FFFFFF', fontSize: hp('3%') }} />
                                        </Button>
                                    </View>
                                    :
                                    null
                                }

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

export default Expenses_2;