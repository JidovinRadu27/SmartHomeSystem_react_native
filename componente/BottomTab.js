import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import HomeScreen from "../Navigation/Screens/HomeScreen";
import MyRooms from "../Navigation/Screens/MyRooms";
import Automation from "../Navigation/Screens/AutomationScreen";
import LoginScreen from "../Navigation/Screens/LoginScreen";

//Screen names
const homeName = "Home";
const myRoomsName = "MyRooms";
const automationName = "Automation";

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === myRoomsName) {
            iconName = focused ? "list" : "list-outline";
          } else if (rn === automationName) {
            iconName = focused ? "settings" : "settings-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "grey",
        headerShown: false,
        tabBarLabelStyle: {
          paddingBottom: 10,
          fontSize: 10,
        },
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      })}
    >
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={myRoomsName} component={MyRooms} />
      <Tab.Screen name={automationName} component={Automation} />
    </Tab.Navigator>
  );
}

export default BottomTab;
