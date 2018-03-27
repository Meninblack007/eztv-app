import React, {
    Component
} from 'react';

import {
    Clipboard,
    Image,
    ImageBackground,
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import Modal from "react-native-modal";

import images from './src/assets/images'

export default class EZTV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            visibleModal: false,
        };
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

    changeState(item) {
        this.setState({
            visibleModal: true,
            itemData: item
        });
    }

    render() {
        return (
            <View style={{ backgroundColor: "#F6F6F6", flex: 1 }}>
                <View style={{ backgroundColor: "white", height: 50 }}>
                    <Text style={styles.heading}>eztv</Text>
                </View>
                {renderIf(this.state.visibleModal,
                    <Modal isVisible={this.state.visibleModal}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{!this.state.itemData ? "" : this.state.itemData.title}</Text>
                            <Text style={styles.modalSize}>Size: {bytesToSize(!this.state.itemData ? "" : this.state.itemData.size_bytes)} </Text>
                            <Text style={styles.modalMarginTop}>Release Date: {convertUnixTimestampToDate(!this.state.itemData ? "" : this.state.itemData.date_released_unix)}</Text>
                            <Text style={styles.modalMarginTop}>Seeds: {!this.state.itemData ? "" : this.state.itemData.seeds}, Peers: {!this.state.itemData ? "" : this.state.itemData.peers}</Text>
                            <View style={styles.modalImageView}>
                                <TouchableOpacity style={styles.modalImageDimension}
                                    onPress={() => {
                                        Clipboard.setString(!this.state.itemData ? "" : this.state.itemData.magnet_url)
                                    }}>
                                    <Image source={images.ic_magnet} style={styles.modalImageDimension} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalImageDimension}
                                    onPress={() => {
                                        Clipboard.setString(!this.state.itemData ? "" : this.state.itemData.torrent_url)
                                    }}>
                                    <Image source={images.ic_download} style={styles.modalImageDimension} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ visibleModal: false })}>
                                <View>
                                    <Text style={styles.modalClose}>Close</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )}
                {renderIf(this.state.isLoading,
                    <View style={styles.roundRect}>
                        <ImageBackground source={images.placeholder} imageStyle={{ borderRadius: 10 }} style={styles.screenshot} />
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
                            <TouchableOpacity
                                onPress={() => {
                                    this.changeState(item);
                                }}>
                                <View style={styles.roundRect}>
                                    <ImageBackground source={getImage(item.large_screenshot)} imageStyle={{ borderRadius: 10 }} style={styles.screenshot}>
                                        <View style={styles.titleBox}>
                                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                            <Text style={styles.date}> {convertUnixTimestampToDate(item.date_released_unix)} </Text>
                                            <Text style={styles.seedsPeers}>Seeds: {item.seeds}, Peers: {item.peers} </Text>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                )}
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
        return images.placeholder;
    } else {
        return {
            uri: "http:" + img
        };
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

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: "bold",
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
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        borderRadius: 4,
        alignItems: 'center',
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold"
    },
    modalSize: {
        marginTop: 15
    },
    modalMarginTop: {
        marginTop: 5
    },
    modalImageView: {
        marginTop: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 100
    },
    modalImageDimension: {
        height: 35,
        width: 35
    },
    modalClose: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 50,
        width: 40
    }
});