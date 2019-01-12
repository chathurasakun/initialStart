import React, { Component } from 'react';
import { Image, ActivityIndicator, AsyncStorage, View } from 'react-native';
import Images from '../utils/images';
import { Actions } from 'react-native-router-flux';
import { updateUser } from '../redux/actions/operations';
import { connect } from 'react-redux';

class Init extends Component {

    componentDidMount = () => {
        AsyncStorage.getItem('key').then((token) => {
            if (token) {
                this.getUser();
            }
            else {
                Actions.login();
            }
        });
    }

    async getUser() {
        let user = await AsyncStorage.getItem('userObj');
        this.props.updateUser(JSON.parse(user));
        Actions.dashboard();
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <Image
                    source={Images.splashLogo3}
                    style={{ flex: 1, width: null, height: null }}
                    blurRadius={100}
                    resizeMode='stretch'
                />
                <ActivityIndicator
                    size='large'
                    color='#FFFFFF'
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            </View>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (user) => {
            dispatch(updateUser(user))
        },
    }
}


export default connect(null, mapDispatchToProps)(Init);