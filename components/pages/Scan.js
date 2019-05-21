import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Camera, Permissions, FileSystem, ImagePicker } from "expo";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default class Scan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      photo: null,
      captureHidden: false
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" }); //If status is true, the camera permissions will be enabled
  }

  captureImage = () => {
    this.setState({ captureHidden: true });
    this.camera.takePictureAsync({
      base64: true,
      onPictureSaved: this.onPictureSaved
    });
    console.log("Image captured!");
  };

  onPictureSaved = async photo => {
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`
    });
    console.log(photo);
  };

  openGallery = async () => {
    let photo = ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      base64: true
    });
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`
    });
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View>
        {this.state.captureHidden ? (
          <ActivityIndicator
            style={styles.spinner}
            size="large"
            color="white"
          />
        ) : (
          <></>
        )}

        <Camera style={styles.preview} ref={camera => (this.camera = camera)}>
          <View style={styles.topToolbar}>
            <TouchableOpacity>
              <Ionicons name="ios-arrow-round-back" size={25} color="white">
                {"  "}Back
              </Ionicons>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openGallery} style={styles.gallery}>
                <SimpleLineIcons name="picture" size={40} color="white"/>
            </TouchableOpacity>
          </View>
          <View style={styles.cameraToolbar}>
            <TouchableOpacity
              style={styles.capture}
              onPress={this.captureImage}
              hide={true}
            >
              <Ionicons
                name="ios-radio-button-off"
                size={this.state.captureHidden ? 0 : 85}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    height: winHeight + 34,
    width: winWidth,
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  capture: {
    justifyContent: "center",
    alignItems: "center"
  },
  cameraToolbar: {
    justifyContent: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    width: "100%",
    marginTop: winHeight - 200
  },
  topToolbar: {
    marginTop: 50,
    marginLeft: 30,
    borderRadius: 30
  },
  spinner: {
    justifyContent: "center",
    alignItems: "center"
  },
  gallery: {
    flexDirection: "row",
    right: 35,
    alignSelf: "flex-end",
    height: 40,
    width: 40,
    position: "absolute",
  }
});
