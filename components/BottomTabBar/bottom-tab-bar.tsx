import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  BookText,
  Dumbbell,
  House,
  ScanQrCode,
  Wallet,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CopilotStep, walkthroughable } from "react-native-copilot";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WalkableView = walkthroughable(View);

const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? "#ffff" : "#797496";
    let size = 25;

    switch (routeName) {
      case "classes":
        return <ScanQrCode color="#ffff" size={40} />;
      case "workout":
        return <Dumbbell color={color} size={size} />;
      case "transaction":
        return <Wallet color={color} size={size} />;
      case "bookings":
        return <BookText color={color} size={size} />;
      default:
        return <House color={color} size={size} />;
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        paddingVertical: 4,
        paddingBottom: insets.bottom + 10,
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "#26213B",
          borderRadius: 24,
          alignItems: "center",
          height: 56,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -7,
            left: 152,
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#0891B2",
          }}
        />
        {state.routes.map((route, index) => {
          const stepMap: Record<string, { order: number; text: string }> = {
            index: {
              order: 1,
              text: "Welcome to your Home! Here you can see your active package and remaining sessions at a glance. Browse the latest promos, check out special classes, and explore all available packages. Your notifications will also appear here so you never miss an update.",
            },
            workout: {
              order: 6,
              text: "This is your Workout page. View your class history to track which sessions you've attended, and use the workout journal to log your personal training notes, sets, reps, or any progress you'd like to record.",
            },
            transaction: {
              order: 7,
              text: "Here you can find your full Transaction History. All your purchases are listed here — filter by status to see completed payments, pending orders, or any cancelled transactions.",
            },
            bookings: {
              order: 8,
              text: "Manage all your Bookings in one place. View upcoming sessions, check ongoing or completed classes, and see any cancelled bookings. You can also make a new booking directly from this page.",
            },
            classes: {
              order: 9,
              text: "Access your Classes here. Sign in to generate your personal QR code, which you can use to check in to any class session. Keep this page handy when you arrive at the gym.",
            },
          };

          const step = stepMap[route.name];

          const { options } = descriptors[route.key];
          const labelOption =
            options.tabBarLabel ?? options.title ?? route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          let label: React.ReactNode;
          if (typeof labelOption === "function") {
            label = labelOption({
              focused: isFocused,
              color: isFocused ? "#ffff" : "#a0aec0",
              position: "below-icon",
              children: route.name,
            });
          } else {
            let displayLabel =
              labelOption.charAt(0).toUpperCase() + labelOption.slice(1);

            label = (
              <Text
                style={{
                  color: isFocused ? "#ffff" : "#a0aec0",
                  textAlign: "center",
                  fontSize: 10,
                }}
              >
                {displayLabel}
              </Text>
            );
          }

          const tabWidth = 70;
          const tabHeight: number | undefined = undefined;
          const tabBorderRadius = 0;
          const tabPaddingVertical = 8;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                width: 70,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              <View style={{ alignItems: "center" }}>
                {step ? (
                  <CopilotStep
                    text={step.text}
                    order={step.order}
                    name={`tab-${route.name}`}
                  >
                    <WalkableView>
                      {getIcon(route.name, isFocused)}
                    </WalkableView>
                  </CopilotStep>
                ) : (
                  getIcon(route.name, isFocused)
                )}

                {route.name !== "classes" && label}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomTabBar;
