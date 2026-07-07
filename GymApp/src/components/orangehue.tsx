import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { colors } from "../constants/theme";

export function OrangeHue() {
  return (
    <Svg style={{ position: "absolute", top: 0, left: 0 }} width="100%" height="100%">
  <Defs>
    <RadialGradient id="glow" cx="100%" cy="0%" r="70%">
      <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.25" />
      <Stop offset="30%" stopColor={colors.accent} stopOpacity="0.25" />
      <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
    </RadialGradient>
  </Defs>
  <Rect width="100%" height="100%" fill="url(#glow)" />
</Svg>
  );
}