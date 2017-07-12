"use strict";

var React = require("react-native");
var Routes = require("../Routes");
var { Icon, } = require('react-native-icons');
var GetVehiclesService = require("../API/GetVehiclesService");
var GetMakesService = require("../API/GetMakesService");

var Vehicle = require("../Database/Vehicle");
var AppInfoView = require("./AppInfoView");
var Theme = require("../Helpers/Theme");
var numeral = require('numeral');
var ImageGalleryView = require("../Components/ImageGalleryView");
var SGListView = require('react-native-sglistview');
var Subscribable = require('Subscribable');
var FilterView = require("./FilterView");
var FilterDataModel = require("../Models/FilterDataModel.js");

var {
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ListView,
    Modal,
    Image,
    ActivityIndicatorIOS,
    Animated,
    TouchableOpacity,
    PixelRatio,
    AsyncStorage
    } = React;

var VehicleSearchView = React.createClass({
    mixins: [Subscribable.Mixin],

    //<editor-fold desc="Render Delegate">
    getInitialState: function () {
        var that = this;
        this.allVehicleData = [];
        this.getVehiclesService = new GetVehiclesService();

        this.imageHeightPercentage = .666666666;
        this.heightOfLabelSection = 64;
        this.maxNumberOfResultsPerPage = 5;
        this.pageNumber = 0;

        this.FIRST_TIME_APP_OPENED_KEY = "FIRST_TIME_APP_OPENED";
        this.MAKES_KEY = "MAKES";
        this.MODELS_KEY = "MODELS";

        this.RANDOM_GENERATED_KEY = Math.random();
        this.isFetchingCarListExecuting = false;
        this.MakesData = [];

        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),

            shouldShowNewUserModal: false,
            shouldShowFiltersModal: false,
            showUntappableOverlay: false,

            activityFadedAnimation: new Animated.Value(1),
            activityIndicatorSpin: true,
            filterDataModel: new FilterDataModel(),
            hasFilters: false,
            hasFiltersText: null,
            hasNoResults: false,
            shouldRemoveLargeActivityIndicator: false
        }
    },

    componentWillMount: function () {
        console.log("Vehicle Search will mount");

        this.addListenerOn(this.props.events, 'filterButtonTapped', this.filterButtonTapped);
        this.addListenerOn(this.props.events, 'drawerDidOpen', this.drawerOpened);
        this.addListenerOn(this.props.events, 'drawerDidClose', this.drawerClosed);

    },

    componentWillUnmount: function () {
        console.log("Vehicle search will unmount");
    },

    componentDidMount: function () {
        var that = this;
        AsyncStorage.getItem(this.FIRST_TIME_APP_OPENED_KEY).then(function (result, error) {
            if (result == null) {
                that.setState({
                    shouldShowNewUserModal: true
                });

                AsyncStorage.setItem(that.FIRST_TIME_APP_OPENED_KEY, "true");
            }
        });

        AsyncStorage.getItem(this.MAKES_KEY).then(function (result, error) {
            if (result == null) {
                that.getAndStoreMakes();
            }
        });

        this.onListViewEndReached();
    },

    filterButtonTapped: function () {
        this.setState({
            shouldShowFiltersModal: true
        });
    },

    onListViewEndReached: function () {
        if (this.isFetchingCarListExecuting) {
            console.log("trying to fetch data again, currently fetching");
            return;
        }

        this.isFetchingCarListExecuting = true;

        var that = this;
        this.pageNumber++;

        this.getVehiclesService.getVehicleData(this.pageNumber, this.maxNumberOfResultsPerPage, this.state.filterDataModel)
            .then(function (vehicleData) {
                vehicleData.map(function (data) {
                    that.allVehicleData.push(data);
                });

                that.updateDataSource(that.allVehicleData);

                console.log(vehicleData);
                if (vehicleData.length <= 0) {

                    that.setState({
                        hasNoResults: true
                    });
                }

                if (that.state.activityIndicatorSpin) {
                    Animated.timing(          // Uses easing functions
                        that.state.activityFadedAnimation,  // The value to drive
                        {toValue: 0}         // Configuration
                    ).start(function () {
                        that.setState({
                            activityIndicatorSpin: false,
                            shouldRemoveLargeActivityIndicator: true
                        });

                        that.isFetchingCarListExecuting = false;
                    });
                }
                else {
                    that.isFetchingCarListExecuting = false;
                }

            })
            .catch(function (err) {
                console.log("Error fetching data");
                console.log(err);
            });
    },

    renderImageGallery: function (obj) {
        var vehicle = obj.getProperties();
        var rows = [];

        for (var index in vehicle.VehicleImages) {
            var imageUrl = vehicle.VehicleImages[index];

            rows.push(
                <TouchableHighlight underlayColor="#EEE"
                                    onPress={() => this.onRowTap(obj)}
                                    key={imageUrl + "-key-image-container-" + index}>
                    <Image source={{uri: (imageUrl) }}
                           key={imageUrl + "-key-image-" + index}
                           style={styles.vehicleImage}
                           resizeMode="cover">
                    </Image>
                </TouchableHighlight>
            );
        }

        return rows;
    },

    //<ScrollView style={{flex:1}} horizontal={true} pagingEnabled={true}>
    //    {this.renderImageGallery(obj)}
    //</ScrollView>

    renderRow: function (obj, something, index) {
        var vehicle = obj.getProperties();

        return (
            <View style={this.gridViewStyleObj(index)}>
                <View style={styles.listViewItem}>
                    <View style={styles.imageViewContainerStyle}>
                        <ImageGalleryView
                            style={{flex:1, backgroundColor:"black"}}
                            imageUrls={vehicle.VehicleImages}
                            ref="imageGallery"
                            shouldShowGalleryWhenTapped={false}
                            onTap={() => this.onRowTap(obj) }/>

                        <View style={styles.priceLabel}>
                            <Text style={styles.moneyLabelStyle}>
                                $
                            </Text>
                            <Text style={styles.priceLabelText}>
                                {numeral(vehicle.VehiclePriceText).format("0,0")}
                            </Text>
                        </View>

                    </View>

                    <View style={[styles.labelViewStyle, {marginTop:0}]}>
                        <View style={{flex:1}}>
                            <Text style={styles.labelViewTextStyle}>
                                {vehicle.VehicleMake + " " + vehicle.VehicleModel + " " + vehicle.VehicleYear}
                            </Text>
                        </View>
                        <View style={{flexDirection:"row", marginTop:2}}>
                            <Text style={[styles.subLabelStyle, {flex:1}]}>
                                {vehicle.VehicleColor}
                            </Text>
                            <View style={{flex:1, flexDirection:"row", justifyContent: "flex-end", paddingRight:10}}>
                                <Icon
                                    style={{width:15, height:15, backgroundColor:"transparent", }}
                                    name='ion|ios-speedometer-outline'
                                    size={15}
                                    color='#333'
                                >
                                </Icon>
                                <Text style={[styles.subLabelStyle]}>
                                    {numeral(vehicle.VehicleMileage).format("0,0")}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableHighlight underlayColor="rgba(100,100,100, 0.1)"
                                        onPress={() => this.onRowTap(obj)}
                                        style={{height:this.heightOfLabelSection, width:Theme.WidthOfDisplay(), position:"absolute", bottom:0}}>
                        <Text></Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    },

    renderFooter: function () {
        if (this.state.hasNoResults) {
            return (
                <View style={{height:65, padding:10}}>
                    <View
                        style={{backgroundColor:"white", alignItems:"center", justifyContent:"center", flex:1, borderTopColor:"#AAA", borderTopWidth:2 }}>
                        {
                            (() => {
                                if (this.allVehicleData.length == 0) {
                                    return (
                                        <Text>
                                            No results found :(
                                        </Text>
                                    );
                                }
                                else {
                                    return (
                                        <Text>
                                            No more results!
                                        </Text>
                                    );
                                }
                            }).call()
                        }

                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={styles.footerViewContainer}>
                    <ActivityIndicatorIOS
                        animating={true}
                        style={[styles.loadingContainerImageView, {height: 80}]}
                        size="small"
                    />
                </View>
            );
        }
    },

    render: function () {
        var that = this;
        return (
            <View style={styles.containerView}>
                <SGListView
                    style={styles.listView}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    contentContainerStyle={styles.list}
                    removeClippedSubviews={true}
                    onEndReached={this.onListViewEndReached}
                    initialListSize={this.maxNumberOfResultsPerPage}
                    onEndReachedThreshold={200}
                    renderFooter={this.renderFooter}
                />

                {
                    (() => {
                        if (!that.state.shouldRemoveLargeActivityIndicator)
                        {
                            return (
                                <Animated.View style={[styles.loadingContainerView, {opacity : this.state.activityFadedAnimation} ]}>
                                    <ActivityIndicatorIOS
                                        animating={this.state.activityIndicatorSpin}
                                        style={[styles.loadingContainerImageView, {height: 50}]}
                                        size="large"
                                    />
                                </Animated.View>
                            );

                        }

                    }).call()
                }
                {
                    (() => {
                    if (that.state.hasFilters) {
                        return (
                            <View style={styles.filterDetailsView}>
                                <TouchableOpacity style={{flex:1, alignItems:"center", justifyContent:"center", paddingLeft:5, paddingRight:5}}
                                                  onPress={() => this.setState({ shouldShowFiltersModal: true })}>
                                    <Text numberOfLines={1} style={styles.filterDetailsViewText}>{ this.state.hasFiltersText }</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    return null;
                    }).call()
                }

                <View style={[styles.untappableOverlay, this.shouldShowOverlay()]}/>
                <Modal
                    animated={true}
                    transparent={false}
                    visible={this.state.shouldShowNewUserModal}
                >
                    <AppInfoView vehicleSearchView={this}/>
                </Modal>
                <Modal
                    animated={true}
                    transparent={false}
                    visible={this.state.shouldShowFiltersModal}
                >
                    <FilterView makeData={this.MakesData} filterDataModel={this.state.filterDataModel} vehicleSearchView={this}/>
                </Modal>
            </View>
        );
    },
    //</editor-fold>

    getAndStoreMakes: function () {
        var makesService = new GetMakesService();
        var that = this;
        makesService.Execute().then(function(result, reject) {
            that.MakesData = result;
        });
    },

    //<editor-fold desc="Drawer Delegate">
    drawerOpen: function (isOpen) {
        this.setState({
            showUntappableOverlay: isOpen
        })
    },
    drawerOpened: function () {
        this.drawerOpen(true);
    },
    drawerClosed: function () {
        this.drawerOpen(false);
    },
    //</editor-fold>

    //<editor-fold desc="Helpers">
    updateDataSource(resultsFromDb) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(resultsFromDb),
        });
    },

    gridViewStyleObj: function (index) {
        var styleObj = {
            backgroundColor: 'white',
            marginBottom: 0,
            flex: 1,
            height: Theme.WidthOfDisplay() * this.imageHeightPercentage + this.heightOfLabelSection,
            overflow: "hidden"
        };

        return styleObj;
    },


    shouldShowOverlay() {
        if (this.state.showUntappableOverlay) {
            return {height: Theme.HeightOfDisplay()};
        }
        else {
            return {height: 0};
        }
    },
    //</editor-fold>

    //<editor-fold desc="Navigation Events">
    onRowTap: function (obj) {
        var vehicleRoute = Routes.getVehicleView();
        vehicleRoute.vehicleData = obj;
        this.props.navigator.push(vehicleRoute);
    },
    //</editor-fold>

    filtersChanged: function () {

        this.setState({
            shouldShowFiltersModal: false,
            hasFilters: this.state.filterDataModel.HasFilters,
            hasFiltersText: this.state.filterDataModel.filtersDisplayText(),
            hasNoResults: false
        });


        this.pageNumber = 0;
        this.allVehicleData = [];
        this.updateDataSource(this.allVehicleData);
        this.onListViewEndReached();
    }
});

var styles = StyleSheet.create({
    containerView: {
        flex: 1,
    },


    listView: {
        backgroundColor: '#EFEFF4',
        flex: 2,
    },
    listViewRow: {
        flex: 1
    },
    listViewItem: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    list: {
        flexDirection: 'column',
        flexWrap: 'wrap'
    },


    vehicleImage: {
        flex: 1,
        height: Theme.WidthOfDisplay() * this.imageHeightPercentage + 2,
        width: Theme.WidthOfDisplay()
    },
    labelViewStyle: {
        paddingTop: 11,
        paddingBottom: 11,
        paddingLeft: 7,
        backgroundColor: "#FFF",
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    subLabelStyle: {
        color: "#777",
        fontSize: 14,
        paddingLeft: 1
    },
    labelViewTextStyle: {
        color: "#333",
        textAlign: "left",
        fontSize: 17,
        overflow: 'hidden',
    },
    imageViewContainerStyle: {
        flex: 1,
        backgroundColor: "#FFF",
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: "#444",
    },
    priceLabel: {
        backgroundColor: "rgba(0,0,0, 0.7)",
        position: "absolute",
        bottom: 10,
        borderRadius: 1,
        left: -5,
        paddingRight: 5,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingTop: 5,
        paddingBottom: 5
    },
    priceLabelText: {
        color: "white",
        fontSize: 17
    },
    moneyLabelStyle: {
        color: "white",
        fontSize: 12,
        paddingLeft: 10,
        paddingBottom: 5
    },

    //For the drawer, so the scrollview events don't interfere with the drawer
    untappableOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "transparent",
        width: Theme.WidthOfDisplay(),
    },

    loadingContainerView: {
        position: "absolute",
        top: 0,
        left: 0,

        width: Theme.WidthOfDisplay(),
        height: Theme.HeightOfDisplay(),
        backgroundColor: "white"
    },
    loadingContainerImageView: {
        flex: 1
    },
    footerViewContainer: {
        width: Theme.WidthOfDisplay(),
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    filterDetailsView: {
        borderTopColor: "#655",
        borderTopWidth: 1 / PixelRatio.get(),
        backgroundColor: Theme.ThirdTint(),
        height: 35,
        alignItems: "center",
        justifyContent: "center"
    },
    filterDetailsViewText: {
        color: "white",
        fontSize: 14,
        fontWeight: "300",
        fontFamily: Theme.Font()
    }
});

module.exports = VehicleSearchView;
