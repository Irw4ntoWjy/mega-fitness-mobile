import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export function InnerShadowOverlay({ height = 24 }: { height?: number }) {
  return (
    <>
      <Svg
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        height={height}
        width="200%"
      >
        <Defs>
          <LinearGradient id="topShadow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="black" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="black" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#topShadow)" />
      </Svg>

      <Svg
        pointerEvents="none"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
        height={height}
        width="200%"
      >
        <Defs>
          <LinearGradient id="bottomShadow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="black" stopOpacity="0" />
            <Stop offset="100%" stopColor="black" stopOpacity="0.18" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bottomShadow)" />
      </Svg>
    </>
  );
}
