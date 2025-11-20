import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BookText, House, ScanQrCode } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      case "explore":
        return <BookText color={color} size={size} />;
      default:
        return <House color={color} size={size} />;
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: 4,
        paddingBottom: insets.bottom,
        justifyContent: "center",
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
            left: 67,
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#0891B2",
          }}
        />
        {state.routes.map((route, index) => {
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

          const tabWidth = 60;
          const tabHeight: number | undefined = undefined;
          const tabBorderRadius = 0;
          const tabPaddingVertical = 8;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                width: tabWidth,
                height: tabHeight,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: tabPaddingVertical,
                backgroundColor: "transparent",
                borderRadius: tabBorderRadius,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {getIcon(route.name, isFocused)}
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
