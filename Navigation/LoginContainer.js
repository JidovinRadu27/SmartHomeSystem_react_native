import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./Screens/LoginScreen";
import WelcomeScreen from "./Screens/WelcomeScreen";
import RegisterEmailPasswordScreen from "./Screens/RegisterEmailPasswordScreen";
import RegisterNameScreen from "./Screens/RegisterNameScreen";
import MainContainer from "./MainContainer";

const { Navigator, Screen } = createNativeStackNavigator();

const LoginContainer = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Welcome" component={WelcomeScreen} />
      <Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      />
      <Screen
        name="RegisterEmailPassword"
        component={RegisterEmailPasswordScreen}
        options={{ title: "Register" }}
      />
      <Screen name="RegisterName" component={RegisterNameScreen} />
    </Navigator>
  );
};

export default LoginContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
