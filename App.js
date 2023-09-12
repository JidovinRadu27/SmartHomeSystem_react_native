import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginContainer from "./Navigation/LoginContainer";
import MainContainer from "./Navigation/MainContainer";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Navigator
        independent={true}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Screen name="LoginContainer" component={LoginContainer} />
        <Screen name="MainContainer" component={MainContainer} />
      </Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
