import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image
} from "react-native";
import LoadingIndicator from "./src/components/LoadingIndicator";
import axios from "axios";

const { height, width } = Dimensions.get("window");

export default class App extends Component {
  state = {
    isLoading: true,
    images: []
  };

  loadWallappers = () => {
    axios
      .get(
        "https://api.unsplash.com/photos/random?count=30&client_id=e0bf4a9aa68971add336133d9fa175d229cc962c2c70131e5d8f017c9980b609"
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

  renderItem = image => {
    return (
      <View style={{ height, width }}>
        <Image
          source={{ uri: image.urls.regular }}
          style={styles.itemImage}
          resizeMode="cover"
        />
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
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={item => item.id}
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
  }
});
