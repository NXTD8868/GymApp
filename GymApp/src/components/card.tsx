import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

type CardProps = ViewProps & {
  raised?: boolean;       // sit on a surface? use surfaceRaised instead
  padded?: boolean;       // default padding on/off
  onPress?: () => void;   // pass this to make the card tappable
};

export function Card({
  raised = false,     
  padded = true,
  onPress,
  style,
  children,
  ...rest
}: CardProps) {
  const base = [
    styles.card,
    { backgroundColor: raised ? colors.surfaceRaised : colors.surface },
    padded && styles.padded,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, pressed && styles.pressed]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={base} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md },
  padded: { padding: spacing.md },
  pressed: { opacity: 0.85 },
});