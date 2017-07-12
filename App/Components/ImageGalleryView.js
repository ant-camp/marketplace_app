
'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;

var {
    TouchableHighlight
    } = React;


class ImageGalleryView extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <RCTImageGalleryView {...this.props} />
        );
    }
}

ImageGalleryView.propTypes = {
    shouldShowGalleryWhenTapped: React.PropTypes.bool,
    imageUrls: React.PropTypes.array,
    onTap: React.PropTypes.func
};


var RCTImageGalleryView = requireNativeComponent('RCTImageGalleryView', ImageGalleryView);

module.exports = ImageGalleryView;
