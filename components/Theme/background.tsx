import React from "react";
import { StyleSheet } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

export function BackgroundGlow({ showText = false }: { showText?: boolean }) {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="pinkGlow" cx="95%" cy="-10%" r="75%">
          <Stop offset="0%" stopColor="#FF4DC3" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#FF4DC3" stopOpacity="0" />
        </RadialGradient>

        <RadialGradient id="cyanGlow" cx="10%" cy="115%" r="75%">
          <Stop offset="0%" stopColor="#5CD6D6" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#5CD6D6" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <Rect width={"100%"} height={"100%"} fill="#FFF6FB" />
      <Rect width={"100%"} height={"100%"} fill="url(#pinkGlow)" />
      <Rect width={"100%"} height={"100%"} fill="url(#cyanGlow)" />

      {showText && (
        <>
          <SvgText
            x={310}
            y={580}
            fontSize={120}
            fontFamily="Afacad-Bold"
            letterSpacing={-60}
            fill="none"
            stroke="#5CD6D6"
            strokeWidth={1.6}
            opacity={0.2}
            textAnchor="middle"
            transform="rotate(-90 310 580)"
          >
            MEGA
          </SvgText>

          <SvgText
            x={360}
            y={580}
            fontSize={120}
            letterSpacing={-60}
            fontFamily="Afacad-Bold"
            fill="none"
            stroke="#5CD6D6"
            strokeWidth={1.6}
            opacity={0.2}
            textAnchor="middle"
            transform="rotate(-90 360 580)"
          >
            MEGA
          </SvgText>

          <SvgText
            x={410}
            y={580}
            letterSpacing={-60}
            fontSize={120}
            fontFamily="Afacad-Bold"
            fill="#5CD6D6"
            opacity={0.4}
            textAnchor="middle"
            transform="rotate(-90 410 580)"
          >
            MEGA
          </SvgText>
        </>
      )}
    </Svg>
  );
}
