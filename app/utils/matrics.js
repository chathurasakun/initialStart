import {Dimensions, Platform} from 'react-native'

const {width, height} = Dimensions.get('window');

const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  tabBarHeight:(Platform.OS === 'ios') ? 48 : 50,
  footerButtonHeight: 64,
  buttonRadius: 4,
  CardImageRatio:(1/1  ),//get image width as 1 (width)3:2(height)
  GudStoryImageRatio:(2/3),//get image width as 1 (width)3:2(height)
  UpcommingCardRatio:(34/45),//get screen width as 1 , (screen)45:34(Upcomming cell width)
  UpcommingCardSelfRatio:(21/17),//get width as 1,(upcomming event home card width)17:21(height)
  EventImageRatio:(637/478),//get width as 1,
  EventImageSize:{width:500,height:500},
	CoverPictureRatio:(320/912),//get width as 1

  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
};

export default metrics;