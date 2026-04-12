import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  BookText,
  Clock3,
  FileQuestionMark,
  House,
  NotepadText,
  ScanQrCode,
  Wallet,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { auth } = useAuth();
  const isTrainer = auth?.accountDetail?.account_role === "Trainer";

  const getIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? "#ffff" : "#797496";
    let size = 25;

    switch (routeName) {
      case "classes":
        return <ScanQrCode color="#ffff" size={40} />;
      case "history":
        return <Clock3 color={color} size={size} />;
      case "transaction":
        return isTrainer ? (
          <NotepadText color={color} size={size} />
        ) : (
          <Wallet color={color} size={size} />
        );
      case "bookings":
        return isTrainer ? (
          <FileQuestionMark color={color} size={size} />
        ) : (
          <BookText color={color} size={size} />
        );
      default:
        return <House color={color} size={size} />;
    }
  };

  const getDisplayLabel = (routeName: string) => {
    if (isTrainer) {
      if (routeName === "transaction") return "Journal";
      if (routeName === "bookings") return "Assessment";
    }

    return routeName.charAt(0).toUpperCase() + routeName.slice(1);
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
              typeof labelOption === "string"
                ? getDisplayLabel(labelOption)
                : getDisplayLabel(route.name);

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
