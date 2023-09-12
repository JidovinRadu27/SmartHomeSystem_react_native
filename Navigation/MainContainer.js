import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "../componente/BottomTab";
import HomeScreen from "./Screens/HomeScreen";
import MyRooms from "./Screens/MyRooms";
import Automation from "./Screens/AutomationScreen";
import RoomScreen from "./Screens/RoomScreen";
import AutomationDeviceScreen from "./Screens/AutomationDeviceScreen";
import AutomationRooms from "./Screens/AutomationRooms";

const { Navigator, Screen } = createNativeStackNavigator();

const MainContainer = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="BottomTab" component={BottomTab} />
      <Screen name="HomeScreen" component={HomeScreen} />
      <Screen name="MyRooms" component={MyRooms} />
      <Screen name="Automation" component={Automation} />
      <Screen name="RoomScreen" component={RoomScreen} />
      <Screen name="AutomationDevice" component={AutomationDeviceScreen} />
      <Screen name="AutomationRooms" component={AutomationRooms} />
    </Navigator>
  );
};

export default MainContainer;
