import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastVariant = "success" | "error" | "warning";

type ToastProps = {
  visible: boolean;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  icon?: React.ReactNode;
  onHide?: () => void;
};

const variantConfig: Record<
  ToastVariant,
  { containerClass: string; textClass: string; iconColor: string }
> = {
  success: {
    containerClass: "bg-green-100 border-green-600",
    textClass: "text-green-800",
    iconColor: "#166534",
  },
  error: {
    containerClass: "bg-red-100 border-red-600",
    textClass: "text-red-800",
    iconColor: "#991B1B",
  },
  warning: {
    containerClass: "bg-amber-100 border-amber-500",
    textClass: "text-amber-800",
    iconColor: "#92400E",
  },
};

export default function Toast({
  visible,
  message,
  variant = "success",
  duration = 2500,
  icon,
  onHide,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();

      if (duration > 0 && onHide) {
        const timer = setTimeout(onHide, duration);
        return () => clearTimeout(timer);
      }
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
    return undefined;
  }, [duration, onHide, progress, visible]);

  const containerStyle = useMemo(
    () => ({
      opacity: progress,
      transform: [
        {
          translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-16, 0],
          }),
        },
      ],
      top: insets.top + 8,
    }),
    [insets.top, progress],
  );

  const colors = variantConfig[variant];
  const defaultIcon =
    variant === "success" ? (
      <CheckCircle2 size={24} color={colors.iconColor} />
    ) : variant === "warning" ? (
      <AlertTriangle size={24} color={colors.iconColor} />
    ) : (
      <XCircle size={24} color={colors.iconColor} />
    );

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 1000,
        },
        containerStyle,
      ]}
    >
      <View className="mx-4 my-3">
        <Pressable
          onPress={onHide}
          className={`rounded-xl border px-4 py-3 shadow-sm ${colors.containerClass}`}
        >
          <View className="flex-row items-start gap-2">
            <View>{icon ?? defaultIcon}</View>
            <Text
              className={`text-lg font-semibold ${colors.textClass} flex-1`}
            >
              {message}
            </Text>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}
