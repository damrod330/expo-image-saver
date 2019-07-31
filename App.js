import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  CameraRoll
} from "react-native";
import LoadingIndicator from "./src/components/LoadingIndicator";
import axios from "axios";
import Icon from "@expo/vector-icons/Ionicons";
import { FileSystem } from "expo";
import { Permissions } from "expo-permissions";

const { height, width } = Dimensions.get("window");

export default class App extends Component {
  constructor() {
    super();

    this.scaleImage = { transform: [{ scale: this.state.scale }] };
    this.actionBarY = this.state.scale.interpolate({
      inputRange: [0.8, 1],
      outputRange: [0, -80]
    });
  }

  state = {
    isLoading: true,
    images: [],
    scale: new Animated.Value(1),
    isImageFocused: false
  };

  saveToCameraRoll = async image => {
    alert("save to camera roll")
    // let cameraPermissions = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    // if (cameraPermissions.status !== "granted") {
    //   cameraPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // }

    // if (cameraPermissions.status === "granted") {
    //   FileSystem.downloadAsync(
    //     image.urls.regular,
    //     FileSystem.documentDirecotory + image.id + ".jpg"
    //   )
    //     .then(({ uri }) => {
    //       CameraRoll.saveToCameraRoll(uri);
    //       alert("saved to photos");
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // } else {
    //   alert("Requires camera roll permission");
    // }
  };

  loadWallappers = () => {
    axios
      .get(
        "https://api.unsplash.com/photos/random?count=10&client_id=e0bf4a9aa68971add336133d9fa175d229cc962c2c70131e5d8f017c9980b609"
      )
      .then(response => {
        this.setState({ images: response.data, isLoading: false });
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        console.log("request completed");
      });
  };

  showControlls = item => {
    this.setState(
      prevState => ({
        isImageFocused: !prevState.isImageFocused
      }),
      () => {
        if (this.state.isImageFocused) {
          Animated.spring(this.state.scale, {
            toValue: 0.8
          }).start();
        } else {
          Animated.spring(this.state.scale, {
            toValue: 1
          }).start();
        }
      }
    );
  };

  renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1 }}>
        <LoadingIndicator />
        <TouchableWithoutFeedback onPress={() => this.showControlls(item)}>
          <Animated.View style={[{ height, width }, this.scaleImage]}>
            <Image
              source={{ uri: item.urls.regular }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: this.actionBarY,
            height: 80,
            backgroundColor: "black",
            justifyContent: "space-around"
          }}
        >
          <View style={styles.drawer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.loadWallappers()}
            >
              <Icon name="ios-refresh" color="white" size={40} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.saveToCameraRoll(item)}
            >
              <Icon name="ios-share" color="white" size={40} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => alert("load images")}
            >
              <Icon name="ios-save" color="white" size={40} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };

  componentDidMount() {
    this.loadWallappers();
  }

  render() {
    return this.state.isLoading ? (
      <LoadingIndicator />
    ) : (
      <View style={styles.container}>
        <FlatList
          horizontal
          pagingEnabled
          data={this.state.images}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={!this.state.isImageFocused}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  itemImage: {
    flex: 1,
    height: null,
    width: null
  },
  drawer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  }
});
