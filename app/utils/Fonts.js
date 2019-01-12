const type = {
    base: 'Lato-Bold',
    emphasis: 'Lato-Bold',
    black: "Lato-Black",
    blackItalic: "Lato-BlackItalic",
    bold: "Lato-Bold",
    boldItalic: "Lato-BoldItalic",
    hairline: "Lato-Hairline",
    hairlineItalic: "Lato-HairlineItalic",
    heavy: "Lato-Heavy",
    heavyItalic: "Lato-HeavyItalic",
    italic: "Lato-Italic",
    light: "Lato-Light",
    lightItalic: "Lato-LightItalic",
    medium: "Lato-Medium",
    mediumItalic: "Lato-MediumItalic",
    regular: "Lato-Regular",
    semibold: "Lato-Semibold",
    semiboldItalic: "Lato-SemiboldItalic",
    thin: "Lato-Thin",
    thinItalic: "Lato-ThinItalic",


}

const size = {
    h1: 38,
    h2: 34,
    h3: 30,
    h4: 26,
    h5: 20,
    h6: 19,
    input: 18,
    regular: 17,

    superlarge:24,
	mediumlarge:22,
    large:20,
    lamedium:18,
    medium: 16,
    smedium: 14,
    small: 13,
    semitiny:12,
    tiny: 11,
    supertiny:10
}

const color = {
	white:"#ffffff",
    _757575:'#757575',
    _9E9E9E:'#9E9E9E',
    _3155A6:'#3155A6',
	_868e96:'#868e96',
	gray_900:"#212529",
	gray_800:'#343a40',
	gray_700:'#495057',
	warm_grey_two:"#9e9e9e",
	steel:"#868e96",
	gray_700:'#495057',
}

const style = {
    h1: {
        fontFamily: type.base,
        fontSize: size.h1
    },
    h2: {
        fontWeight: 'bold',
        fontSize: size.h2
    },
    h3: {
        fontFamily: type.emphasis,
        fontSize: size.h3
    },
    h4: {
        fontFamily: type.base,
        fontSize: size.h4
    },
    h5: {
        fontFamily: type.base,
        fontSize: size.h5
    },
    h6: {
        fontFamily: type.emphasis,
        fontSize: size.h6
    },
    normal: {
        fontFamily: type.base,
        fontSize: size.regular
    },
    description: {
        fontFamily: type.base,
        fontSize: size.medium
    },

    card_title_small_heavy: {
        fontFamily: type.heavy,
        fontSize: size.small,

    },
    card_title_medium_heavy: {
        fontFamily: type.heavy,
        fontSize: size.medium,
    },
    card_body_small_regular: {
        fontFamily: type.regular,
        fontSize: size.small
    },
    card_body_tiny_regular: {
        fontFamily: type.regular,
        fontSize: size.tiny
    },
    card_body_semitiny_regular: {
        fontFamily: type.regular,
        fontSize: size.semitiny
    },


    section_title_medium_regular: {
        fontFamily: type.regular,
        fontSize: size.medium
    },

    section_title_heavy_large:{
        fontFamily: type.heavy,
        fontSize: size.large
    },

	regular_large:{
		fontFamily: type.regular,
		fontSize: size.large
	},

    more_smedium_regular:{
        fontFamily: type.regular,
        fontSize: size.smedium,
        color:color._757575
    },
    smedium_regular:{
        fontFamily: type.regular,
        fontSize: size.smedium,
    },

    heavy_small:{
        fontFamily:type.heavy,
        fontSize:size.small
    },
    regular_tiny:{
        fontFamily:type.regular,
        fontSize:size.tiny
    },

    semibold_small:{
        fontFamily:type.semibold,
        fontSize:size.small
    },

    semibold_supertiny:{
        fontFamily:type.semibold,
        fontSize:size.supertiny
    },

    semitiny_semibold: {
        fontFamily: type.semibold,
        fontSize: size.semitiny
    },
    smedium_semibold:{
        fontFamily: type.semibold,
        fontSize: size.smedium
    },
    small_regular:{
        fontFamily: type.regular,
        fontSize: size.small
    },
    lamedium_semibold:{
        fontFamily: type.semibold,
        fontSize: size.lamedium
    },
    semitiny_regular: {
        fontFamily: type.regular,
        fontSize: size.semitiny
    },
    semitiny_heavy: {
        fontFamily: type.heavy,
        fontSize: size.semitiny
    },
    medium_heavy:{
        fontFamily: type.heavy,
        fontSize: size.medium
    },
	medium_bold:{
        fontFamily: type.bold,
        fontSize: size.medium
    },
	smedium_bold:{
        fontFamily: type.bold,
        fontSize: size.smedium
    },
	medium_regular:{
		fontFamily: type.regular,
		fontSize: size.medium
	},
	bold_large:{
		fontFamily: type.bold,
		fontSize: size.large
	},
	smedium_medium:{
		fontFamily: type.medium,
		fontSize: size.smedium
	},
	small_bold:{
		fontFamily: type.bold,
		fontSize: size.small
	},
	superlarge_bold:{
		fontFamily: type.bold,
		fontSize: size.superlarge
	},
	tiny_regular:{
		fontFamily: type.regular,
		fontSize: size.tiny
	},
	mediumlarge_bold:{
		fontFamily: type.bold,
		fontSize: size.mediumlarge
	},
	semitiny_medium:{
		fontFamily: type.medium,
		fontSize: size.semitiny
	}


}

export default {
    type,
    size,
    style,
    color
}
