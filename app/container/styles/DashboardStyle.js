import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    buttonContainer: {
        height: hp('7%'),
        justifyContent: 'center',
        marginBottom: hp('2%'),
        width: wp('70%'),
        borderRadius: wp('2%')
    },
    secondButtonContainer: {
        height: hp('7%'),
        justifyContent: 'center',
        width: wp('70%'),
        borderRadius: wp('2%')
    },
    listContainer: {
        marginTop: hp('1%'),
        width: wp('100%'),
    },
    button1: {
        backgroundColor: '#00a65a',
    },
    button2: {
        backgroundColor: '#FFFFFF',
    },
    text1: {
        color: '#FFFFFF',
        fontWeight: '500',
        fontSize: hp('2.7%')
    },
    text2: {
        color: '#007CC4',
        fontWeight: '500',
        fontSize: hp('2.7%')
    },
    sectionOrg: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    tabBarUnderline: {
        borderBottomWidth: 0,
        backgroundColor: '#E0E0E0',
        height: 2
    },
    tabBarCustomButton: {
        marginLeft: Platform.OS === "ios" ? -7 : -8, height: 30,
        paddingTop: Platform.OS === "ios" ? 6 : 16
    },
    tabBarCustomIcon: {
        fontSize: Platform.OS === "ios" ? 33 : 24,
        marginTop: 2,
        marginRight: 5,
        marginLeft: 2,
        color: "black"
    },
    tabHeading: {
        backgroundColor: 'white'
    },
    tabStyle: {
        backgroundColor: 'white'
    },
    activeTabStyle: {
        backgroundColor: '#008b00'
    },
    tabHeadingText: {
        fontSize: hp('2%'),
        color: 'rgba(0,0,0,0.38)',
    },
    activeTabHeadingText: {
        fontSize: hp('2%'),
        color: 'white',
    },
});

export default styles;