import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

export function BackgroundGlow({ showText = false }: { showText?: boolean }) {
  const { width, height } = useWindowDimensions();

  const isTablet = Math.min(width, height) >= 600;

  const fontSize = height * 0.15;
  const strokeWidth = Math.max(width, height) * 0.003;

  const letterSpacing = isTablet ? 0 : -fontSize * 0.4;

  const baseX = width * 0.6;
  const baseY = height * 0.6;

  const offsetX = fontSize * 0.9;

  const firstX = baseX + offsetX * (isTablet ? 1.2 : 0.7);
  const secondX = baseX + offsetX * (isTablet ? 1.6 : 1.1);
  const thirdX = baseX + offsetX * (isTablet ? 2.0 : 1.5);

  const outlineOpacity = isTablet ? 0.2 : 0.16;
  const solidOpacity = isTablet ? 0.4 : 0.5;

  return (
    <Svg
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
    >
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

      <Rect width="100%" height="100%" fill="#FFF6FB" />
      <Rect width="100%" height="100%" fill="url(#pinkGlow)" />
      <Rect width="100%" height="100%" fill="url(#cyanGlow)" />

      {showText && (
        <>
          <SvgText
            x={firstX}
            y={baseY}
            fontSize={fontSize}
            fontFamily="Afacad-Bold"
            letterSpacing={letterSpacing}
            fill="none"
            stroke="#5CD6D6"
            strokeWidth={strokeWidth}
            opacity={outlineOpacity}
            textAnchor="middle"
            transform={`rotate(-90 ${firstX} ${baseY})`}
          >
            MEGA
          </SvgText>

          <SvgText
            x={secondX}
            y={baseY}
            fontSize={fontSize}
            fontFamily="Afacad-Bold"
            letterSpacing={letterSpacing}
            fill="none"
            stroke="#5CD6D6"
            strokeWidth={strokeWidth}
            opacity={outlineOpacity}
            textAnchor="middle"
            transform={`rotate(-90 ${secondX} ${baseY})`}
          >
            MEGA
          </SvgText>

          <SvgText
            x={thirdX}
            y={baseY}
            fontSize={fontSize}
            fontFamily="Afacad-Bold"
            letterSpacing={letterSpacing}
            fill="#5CD6D6"
            opacity={solidOpacity}
            textAnchor="middle"
            transform={`rotate(-90 ${thirdX} ${baseY})`}
          >
            MEGA
          </SvgText>
        </>
      )}
    </Svg>
  );
}
