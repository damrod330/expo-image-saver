import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default class LoadingIndicator extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="yellow" />
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
  }
});
