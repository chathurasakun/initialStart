import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    inputContainer: {
        borderBottomColor: '#007CC4',
        borderBottomWidth: 1,
        width: wp('80%'),
        height: hp('5%'),
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputs: {
        backgroundColor: 'transparent',
        fontSize: hp('2%'),
        height: hp('10%'),
        flex: 1,
        color: '#BBBDC0'
    },
    buttonContainer: {
        height: hp('6%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: wp('60%'),
        borderRadius: wp('2%'),
        borderColor:'#007CC4'
    },
    loginButton: {
        backgroundColor: '#007CC4'
    },
    registerButton:{
        backgroundColor:'#FFFFFF'
    },
    loginText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: hp('2%')
    },
    registerText: {
        color: '#007CC4',
        fontWeight: 'bold',
        fontSize: hp('2%')
    }
});

export default styles;