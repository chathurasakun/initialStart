import { Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HeaderBarStyle = {

    header: {
        backgroundColor: "white",
        flexDirection: 'row'
    },
    icon: {
        color: "black",
    },

    titleHeader: {
        color: 'black'
    },
    tabBarUnderline: {
        borderBottomWidth: 0,
        backgroundColor: 'white',
        height: 1
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
        backgroundColor: 'white'
    },
    tabHeadingText: {
        fontSize: hp('1.8%'),
        color: '#9B9B9B',
    },
    activeTabHeadingText: {
        fontSize: hp('1.8%'),
        color: '#007CC4',
    }
}

export default HeaderBarStyle;