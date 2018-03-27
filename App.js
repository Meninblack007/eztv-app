import React, {
    Component
} from 'react';

import {
    Image,
    ImageBackground,
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class EZTV extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };
    }

    componentDidMount() {
        var self = this;
        fetchJSON((json) => {
            console.log("Success")
            self.setState({
                isLoading: false,
                dataSource: json
            })
        });
    }

    render() {
        return (
            <View style={{ backgroundColor: "#F6F6F6", flex: 1 }}>
                <View style={{ backgroundColor: "white", height: 60 }}>
                    <Text style={styles.heading}>eztv</Text>
                </View>
                {renderIf(this.state.isLoading,
                    <View style={styles.roundRect}>
                        <ImageBackground source={{ uri: "placeholder" }} imageStyle={{ borderRadius: 10 }} style={styles.screenshot} />
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>Loading...</Text>
                        </View>
                    </View>,
                    <FlatList
                        data={this.state.dataSource}
                        keyExtractor={(item, index) => {
                            return index.toString();
                        }}
                        renderItem={({ item }) =>
                            <View style={styles.roundRect}>
                                <ImageBackground source={{ uri: getImage(item.large_screenshot) }} imageStyle={{ borderRadius: 10 }} style={styles.screenshot}>
                                    <View style={styles.titleBox}>
                                        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.date}> {convertUnixTimestampToDate(item.date_released_unix)} </Text>
                                        <Text style={styles.seedsPeers}>Seeds: {item.seeds}, Peers: {item.peers} </Text>
                                    </View>
                                </ImageBackground>
                            </View>
                        } />)}
            </View>
        )
    }
}

function fetchJSON(json) {
    return fetch("https://eztv.ag/api/get-torrents")
        .then((response) => response.json())
        .then((responseJSON) => {
            json(responseJSON.torrents);
        })
        .catch((error) => {
            console.error("JSON not found");
        });
};

function renderIf(condition, trueCondition, falseCondition) {
    if (condition) {
        return trueCondition;
    } else {
        return falseCondition;
    }
};

function getImage(img) {
    if (img === "") {
        return "placeholder";
    } else {
        return "http:" + img;
    }
};

function convertUnixTimestampToDate(timestamp) {
    var stamp = new Date(timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = stamp.getFullYear();
    var month = months[stamp.getMonth()];
    var date = stamp.getDate();
    var time = date + " " + month + " " + year;
    return time;
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        marginTop: 20,
        textAlign: "center"
    },
    roundRect: {
        backgroundColor: "white",
        margin: 10,
        borderRadius: 10,
        elevation: 5
    },
    screenshot: {
        height: 180
    },
    titleBox: {
        backgroundColor: 'rgba(52, 52, 52, 0.6)',
        height: 50,
        width: "100%",
        position: 'absolute',
        bottom: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    title: {
        color: "white",
        fontSize: 18,
        marginTop: 5,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10
    },
    date: {
        color: "white",
        position: 'absolute',
        bottom: 0,
        paddingLeft: 10,
        paddingBottom: 5
    },
    seedsPeers: {
        color: "white",
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingRight: 10,
        paddingBottom: 5
    }
});