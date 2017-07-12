
var Dimensions = require("Dimensions");

class Theme {
    static PrimaryColor() {
        return "#106fab";
    }

    static TintColor() {
        return "#FFF";
    }

    static SecondaryTint() {
        return "#02C39A";
    }

    static ThirdTint() {
        return "#028090";
    }

    static DarkThirdTint() {
        return "#026a77";
    }

    static WidthOfDisplay() {
        return Dimensions.get("window").width;
    }

    static HeightOfDisplay() {
        return Dimensions.get("window").height;
    }

    static Font() {
        return "Open Sans";
    }
}


module.exports = Theme;
