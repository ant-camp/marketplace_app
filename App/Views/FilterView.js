"use strict";

var React = require("react-native");
var { Icon, } = require('react-native-icons');
var Theme = require("../Helpers/Theme");
var GetModelsService = require("../API/GetModelsService");

var {
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ScrollView,
    TouchableOpacity,
    PixelRatio,
    PickerIOS,
    Animated,
    TextInput,
    Modal
    } = React;


var AUTOMOBILE_TYPES = [
    {DisplayText: "Automobile", Value: 1},
    {DisplayText: "Motorcycle", Value: 2}
];

var YEARS = [
    {DisplayText: "All", Value: 0}
];

for (var i = new Date().getYear() + 1901; i >= 1980; i--) {
    var index = YEARS.length - 1;

    YEARS.push({
        DisplayText: i.toString(),
        Value: index
    })
}

var TAPPED_ON_FILTER_KEYS = {
    None: "None",
    AutomobileType: "Type",
    AutomobileMake: "Make",
    AutomobileModel: "Model",
    AutomobileYear: "Year",
    PriceMin: "Price Min.",
    PriceMax: "Price Max"
};

var FilterView = React.createClass({
    getInitialState: function () {
        var autoMakes = [{DisplayText: "All", Value: 0}];
        var autoModels = [{DisplayText: "Loading", Value: 0}];

        if (this.props.filterDataModel.Model.Value == this.props.filterDataModel.ALL_VALUE) {
            autoModels = [{DisplayText: "All", Value: 0}];
        }

        for (var index in this.props.makeData) {
            var value = index + 1;
            var makeName = this.props.makeData[index];
            autoMakes.push({
                DisplayText: makeName,
                Value: value
            });
        }

        return {
            automobileTypeIndex: 0,
            automobileMakeIndex: this.props.filterDataModel.Make.Value,
            automobileModelIndex: 0,
            yearIndex: this.props.filterDataModel.Year.Value,
            tappedOnFilter: TAPPED_ON_FILTER_KEYS.None,
            animatedBottomRowHeight: new Animated.Value(65),
            automobileMakes: autoMakes,
            automobileModels: autoModels,
            minimumPrice: this.props.filterDataModel.Minimum,
            minimumPriceText: this.props.filterDataModel.Minimum.Value,
            maximumPrice: this.props.filterDataModel.Maximum,
            maximumPriceText: this.props.filterDataModel.Maximum.Value
        };
    },

    componentWillMount: function () {
        if (this.props.filterDataModel.Model.Value != 0) {
            if (this.state.automobileMakeIndex == 0)
                return;

            this.loadModels(this.state.automobileMakeIndex, this.props.filterDataModel.Model.Value);
        }
        else if (this.state.automobileMakeIndex != 0) {
            this.loadModels(this.state.automobileMakeIndex, this.props.filterDataModel.ALL_VALUE);
        }
    },

    render: function () {
        var bottomStaticRow = null;
        var doneButtonRow = (
            <View style={styles.doneButtonRow}>
                <Text style={{flex:1, paddingLeft:15, fontSize:17, fontFamily:Theme.Font(), fontWeight:"100" }}>
                    Select {this.state.tappedOnFilter}
                </Text>
                <TouchableOpacity style={styles.doneButton}
                                  onPress={ () => this.changeFilterState(TAPPED_ON_FILTER_KEYS.None) }>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        );

        switch (this.state.tappedOnFilter) {
            case TAPPED_ON_FILTER_KEYS.None:
                bottomStaticRow = (
                    <Animated.View style={[styles.bottomButtonContainer, {height: this.state.animatedBottomRowHeight}]}>
                        <TouchableOpacity style={{flex:1}} onPress={this.resetFilters}>
                            <Text style={[styles.standardText, {fontSize:20}]}>
                                Reset
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1, alignItems:"flex-end"}} onPress={this.applyFiltersTapped}>
                            <Text style={[styles.standardText, {fontSize:20}]}>
                                Apply
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>);
                break;
            case TAPPED_ON_FILTER_KEYS.AutomobileType:
                bottomStaticRow = (
                    <Animated.View style={[styles.pickerContainer, {height: this.state.animatedBottomRowHeight}]}>
                        {doneButtonRow}
                        <PickerIOS key={"automobileType"}
                                   selectedValue={this.state.automobileTypeIndex}
                                   onValueChange={(value) => this.setState({ automobileTypeIndex: value })}>

                            {AUTOMOBILE_TYPES.map((data, index) => (
                                <PickerIOS.Item
                                    key={"automobileType-" + index}
                                    value={index}
                                    label={data.DisplayText}
                                />
                            ))}

                        </PickerIOS>
                    </Animated.View>
                );
                break;
            case TAPPED_ON_FILTER_KEYS.AutomobileMake:
                bottomStaticRow = (
                    <Animated.View style={[styles.pickerContainer, {height: this.state.animatedBottomRowHeight} ]}>
                        {doneButtonRow}
                        <PickerIOS key={"automobileMake"}
                                   selectedValue={ this.state.automobileMakeIndex }
                                   onValueChange={(value) => {
                                   this.makeChanged(value);
              }}>

                            {this.state.automobileMakes.map((data, index) => (
                                <PickerIOS.Item
                                    key={"automobileMake-" + index}
                                    value={index}
                                    label={data.DisplayText}
                                />
                            ))}

                        </PickerIOS>
                    </Animated.View>
                );
                break;
            case TAPPED_ON_FILTER_KEYS.AutomobileModel:
                bottomStaticRow = (
                    <Animated.View style={[styles.pickerContainer, {height: this.state.animatedBottomRowHeight} ]}>
                        {doneButtonRow}
                        <PickerIOS key={"automobileModel"}
                                   selectedValue={ this.state.automobileModelIndex }
                                   onValueChange={(value) => {
                this.setState({ automobileModelIndex: value });
                this.props.filterDataModel.setModelFilter(this.state.automobileModels[value].DisplayText, value);
              }}>

                            {this.state.automobileModels.map((data, index) => (
                                <PickerIOS.Item
                                    key={"automobileModel-" + index}
                                    value={index}
                                    label={data.DisplayText}
                                />
                            ))}

                        </PickerIOS>
                    </Animated.View>
                );
                break;
            case TAPPED_ON_FILTER_KEYS.AutomobileYear:
                bottomStaticRow = (
                    <Animated.View style={[styles.pickerContainer, {height: this.state.animatedBottomRowHeight} ]}>
                        {doneButtonRow}
                        <PickerIOS key={"automobileYear"}
                                   selectedValue={ this.state.yearIndex }
                                   onValueChange={(value) => {
                this.setState({ yearIndex: value });
                this.props.filterDataModel.setYearFilter(YEARS[value].DisplayText, value);
              }}>

                            {YEARS.map((data, index) => (
                                <PickerIOS.Item
                                    key={"automobileYear-" + index}
                                    value={index}
                                    label={data.DisplayText}
                                />
                            ))}

                        </PickerIOS>
                    </Animated.View>
                );
                break;
            case TAPPED_ON_FILTER_KEYS.PriceMin:

                var that = this;
                setTimeout(function () {
                    that.refs.minimum_price.focus();
                }, 10);
                break;
            case TAPPED_ON_FILTER_KEYS.PriceMax:

                var that = this;
                setTimeout(function () {
                    that.refs.maximum_price.focus();
                }, 10);
                break;
        }

        return (
            <View style={{flex:1, backgroundColor: Theme.ThirdTint()}}>
                <ScrollView style={styles.container} ref="scrollView" keyboardDismissMode="on-drag">
                    <TouchableOpacity style={styles.xButtonContainer}
                                      onPress={() => this.props.vehicleSearchView.setState({shouldShowFiltersModal: false})}>
                        <Icon
                            style={{width:30, height:50, backgroundColor:"transparent" }}
                            name='ion|close'
                            size={23}
                            color='#FFF'
                        >
                        </Icon>
                    </TouchableOpacity>
                    <View style={styles.contentView}>
                        <View style={styles.headerView}>
                            <Text style={styles.headerText}>
                                Filters
                            </Text>
                        </View>
                        <View style={styles.centeredRow}>
                            <Icon
                                style={{ width:23, height:23, backgroundColor:"transparent", marginRight:5 }}
                                name='ion|android-car'
                                size={23}
                                color='#FFF'
                            >
                            </Icon>
                            <Text style={[styles.standardText]}>Vehicle</Text>
                        </View>

                        <View style={styles.filterRow}>
                            <Text style={[styles.standardText, styles.filterRowLeftColumn]}>
                                Make:
                            </Text>
                            <TouchableOpacity style={styles.filterRowRightColumn}
                                              onPress={() => this.changeFilterState(TAPPED_ON_FILTER_KEYS.AutomobileMake)}>
                                <Text style={[styles.filterText]} numberOfLines={1}>
                                    {this.state.automobileMakes[this.state.automobileMakeIndex].DisplayText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filterRow}>
                            <Text style={[styles.standardText, styles.filterRowLeftColumn]}>
                                Model:
                            </Text>
                            <TouchableOpacity style={styles.filterRowRightColumn}
                                              onPress={() => this.changeFilterState(TAPPED_ON_FILTER_KEYS.AutomobileModel)}>
                                <Text style={[styles.filterText]} numberOfLines={1}>
                                    {this.state.automobileModels[this.state.automobileModelIndex].DisplayText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filterRow}>
                            <Text style={[styles.standardText, styles.filterRowLeftColumn]}>
                                Year:
                            </Text>
                            <TouchableOpacity style={styles.filterRowRightColumn}
                                              onPress={() => this.changeFilterState(TAPPED_ON_FILTER_KEYS.AutomobileYear)}>
                                <Text style={[styles.filterText]} numberOfLines={1}>
                                    {YEARS[this.state.yearIndex].DisplayText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.centeredRow, {marginTop:25}]}>
                            <Icon
                                style={{width:17, height:17, backgroundColor:"transparent", marginRight:5 }}
                                name='fontawesome|usd'
                                size={17}
                                color='#FFF'
                            >
                            </Icon>
                            <Text style={styles.standardText}>Price</Text>
                        </View>
                        <View style={styles.filterRow}>
                            <Text style={[styles.standardText, styles.filterRowLeftColumn]}>
                                Minimum:
                            </Text>
                            {
                                (() => {
                                    if (this.state.tappedOnFilter == TAPPED_ON_FILTER_KEYS.PriceMin) {
                                        return (
                                            <TextInput ref="minimum_price"
                                                       keyboardType={"numbers-and-punctuation"}
                                                       onFocus={ () => this.inputFocused("minimum_price")}
                                                       onSubmitEditing={ () => this.minimumPriceSubmitted() }
                                                       onBlur={ () => this.minimumPriceSubmitted() }
                                                       placeholder="$ 0"
                                                       onChangeText={(text) => this.setState({ minimumPriceText: text }) }
                                                       value={this.state.minimumPriceText}
                                                       style={
                                                [ { height:30, backgroundColor:"white", padding:5, borderRadius:5, textAlign:"right" }, styles.filterRowRightColumn]
                                            }/>
                                        );
                                    }
                                    else {
                                        return (
                                            <TouchableOpacity style={styles.filterRowRightColumn}
                                                              onPress={() => this.changeFilterState(TAPPED_ON_FILTER_KEYS.PriceMin)}>
                                                <Text style={[styles.filterText]}>
                                                    {this.state.minimumPrice.Name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                }).call()
                            }

                        </View>
                        <View style={[styles.filterRow, {marginBottom:50}]}>
                            <Text style={[styles.standardText, styles.filterRowLeftColumn]}>
                                Maximum:
                            </Text>
                            {
                                (() => {
                                    if (this.state.tappedOnFilter == TAPPED_ON_FILTER_KEYS.PriceMax) {
                                        return (
                                            <TextInput ref="maximum_price"
                                                       keyboardType={"numbers-and-punctuation"}
                                                       onFocus={ () => this.inputFocused("maximum_price")}
                                                       onSubmitEditing={ () => this.maximumPriceSubmitted() }
                                                       placeholder="$ 0"
                                                       onBlur={ () => this.maximumPriceSubmitted() }
                                                       onChangeText={(text) => this.setState({ maximumPriceText: text }) }
                                                       value={this.state.maximumPriceText}
                                                       style={
                                                [ { height:30, backgroundColor:"white", padding:5, borderRadius:5, textAlign:"right" }, styles.filterRowRightColumn]
                                            }/>
                                        );
                                    }
                                    else {
                                        return (
                                            <TouchableOpacity style={styles.filterRowRightColumn}
                                                              onPress={() => this.changeFilterState(TAPPED_ON_FILTER_KEYS.PriceMax)}>
                                                <Text style={[styles.filterText]}>
                                                    {this.state.maximumPrice.Name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                }).call()
                            }
                        </View>
                    </View>
                </ScrollView>


                {bottomStaticRow}

            </View>
        );
    },
    changeFilterState: function (state, animated = true) {
        this.setState({tappedOnFilter: state});
        if (state != TAPPED_ON_FILTER_KEYS.None) {
            if (animated) {
                Animated.spring(                          // Base: spring, decay, timing
                    this.state.animatedBottomRowHeight,                 // Animate `bounceValue`
                    {
                        toValue: 250                          // Bouncier spring
                    }
                ).start();
            }
            else {
                this.state.animatedBottomRowHeight.setValue(250);
            }
        }
        else {
            if (animated) {
                Animated.spring(                          // Base: spring, decay, timing
                    this.state.animatedBottomRowHeight,                 // Animate `bounceValue`
                    {
                        toValue: 65                          // Bouncier spring
                    }
                ).start();
            }
            else {
                this.state.animatedBottomRowHeight.setValue(65);
            }
        }
    },

    makeChanged: function (value) {
        this.setState({
            automobileMakeIndex: value,
            automobileModelIndex: 0,
            automobileModels: [{DisplayText: "Loading", Value: 0}]
        });
        this.props.filterDataModel.setMakeFilter(this.state.automobileMakes[value].DisplayText, value);
        this.props.filterDataModel.setModelFilter("", 0);

        this.loadModels(value, this.state.automobileModelIndex);
    },

    minimumPriceSubmitted: function () {
        var theValue = this.state.minimumPriceText;

        var noAnimation = false;
        this.changeFilterState(TAPPED_ON_FILTER_KEYS.None, noAnimation);

        if (theValue != null && theValue.length > 0) {
            this.props.filterDataModel.setMinimumFilter("$" + theValue, theValue);

            this.setState({
                minimumPrice: {Value: theValue, Name: "$" + theValue}
            });
        } else {
            this.props.filterDataModel.setMinimumFilter(null, this.props.filterDataModel.ALL_VALUE);
            this.setState({
                minimumPrice: {Value: null, Name: "None"}
            });
        }
    },

    maximumPriceSubmitted: function () {
        var theValue = this.state.maximumPriceText;

        var noAnimation = false;
        this.changeFilterState(TAPPED_ON_FILTER_KEYS.None, noAnimation);

        if (theValue != null && theValue.length > 0) {
            this.props.filterDataModel.setMaximumFilter("$" + theValue, theValue);

            this.setState({
                maximumPrice: {Value: theValue, Name: "$" + theValue}
            });
        } else {
            this.props.filterDataModel.setMaximumFilter(null, this.props.filterDataModel.ALL_VALUE);
            this.setState({
                maximumPrice: {Value: null, Name: "None"}
            });
        }
    },

    loadModels: function (value, selectedModelIndex) {
        var automobileMakeName = this.state.automobileMakes[value];
        var modelService = new GetModelsService();
        var that = this;

        modelService.Execute(automobileMakeName.DisplayText).then(function (result) {
            var automobileModels = [{DisplayText: "All", Value: 0}];

            if (result != null) {
                for (var index in result) {
                    var value = index + 1;
                    var modelName = result[index];
                    automobileModels.push({
                        DisplayText: modelName,
                        Value: value
                    });
                }

                that.setState({automobileModelIndex: selectedModelIndex, automobileModels: automobileModels});
            }
            else {
                that.setState({automobileModels: [{DisplayText: "All", Value: 0}]});
            }
        }).catch(function (err) {
            that.setState({
                automobileModels: [{DisplayText: "Error", Value: 0}]
            });
        });
    },
    applyFiltersTapped: function () {
        this.props.filterDataModel.commitChanges();
        this.props.vehicleSearchView.filtersChanged();
    },
    resetFilters: function () {
        this.props.filterDataModel.filterDefaults();
        this.props.vehicleSearchView.filtersChanged();
    },
    // Scroll a component into view. Just pass the component ref string.
    inputFocused (refName) {
        setTimeout(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                React.findNodeHandle(this.refs[refName]),
                110, //additionalOffset
                true
            );
        }, 50);
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
    },
    xButtonContainer: {
        height: 35,
        alignItems: "flex-end",
    },
    contentView: {
        paddingLeft: 25,
        paddingRight: 25
    },
    headerView: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderBottomColor: "white",
        borderBottomWidth: 1 / PixelRatio.get()
    },
    headerText: {
        fontSize: 25,
        fontFamily: Theme.Font(),
        fontWeight: "100",
        color: "white"
    },
    standardText: {
        color: "white",
        fontSize: 18,
        fontWeight: "100",
        fontFamily: Theme.Font(),
    },
    centeredRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15
    },
    filterRow: {
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 15
    },
    filterRowLeftColumn: {
        flex: 1
    },
    filterRowRightColumn: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    filterText: {
        color: Theme.SecondaryTint(),
        fontSize: 18,
        fontWeight: "500",
        fontFamily: Theme.Font(),
        paddingLeft: 5,
        paddingRight: 5,
        flex: 1
    },
    bottomButtonContainer: {
        height: 65,
        backgroundColor: "rgba(0, 0, 0, .39)",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 30,
        paddingRight: 30
    },
    pickerContainer: {
        backgroundColor: "#DDD"
    },
    doneButtonRow: {
        borderBottomColor: "#999",
        borderBottomWidth: 1 / PixelRatio.get(),
        borderTopColor: "#999",
        borderTopWidth: 1 / PixelRatio.get(),
        height: 40,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: 10,
        flexDirection: "row",
    },
    doneButton: {
        width: 50,
        marginTop: -2
    },
    doneButtonText: {
        color: Theme.SecondaryTint(),
        fontSize: 18,
        fontWeight: "500",
        fontFamily: Theme.Font()
    }
});


module.exports = FilterView;
