import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../constants/theme";

export function LogoBadge() {
  return (
    <LinearGradient
      colors={[colors.accent, colors.accentSecondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: 46,
        height: 46,
        borderRadius: 12,          // 23 (= half) for a full circle
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.accent, // the orange glow
        shadowOpacity: 0.4,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,             
      }}
    >
      <Ionicons name="flash" size={24} color={colors.background} />
    </LinearGradient>
  );
}