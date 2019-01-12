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
        backgroundColor: '#021aee'
    },
    tabHeadingText: {
        fontSize: hp('2.5%'),
        color: 'rgba(0,0,0,0.38)',
    },
    activeTabHeadingText: {
        fontSize: hp('2.5%'),
        color: 'white',
    }
}

export default HeaderBarStyle;