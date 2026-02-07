import { Alert, Platform, ToastAndroid } from "react-native";

export const toast = {
  success: (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
    // iOS: Silent success or lightweight alert
    console.log("Toast Success:", msg);
  },
  error: (msg) => {
    Alert.alert("Error", msg);
  },
  warning: (msg) => {
    Alert.alert("Warning", msg);
  },
  info: (msg) => {
    Alert.alert("Info", msg);
  },
};

export default toast;
