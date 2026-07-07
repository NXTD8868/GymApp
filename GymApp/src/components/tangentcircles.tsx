import { colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
type TangentCirclesProps = {
  size?: number;          // outer ring diameter
  innerSize?: number;     // inner ring diameter
  top?: number;           // outer ring offset from top
  right?: number;         // outer ring offset from right
  touchAngle?: number;    // where they touch, in degrees (0 = right, 90 = top)
  color?: string;
  borderWidth?: number;
  outerOpacity?: number;
  innerOpacity?: number;
};
export function TangentCircles ({
    size = 300,
    innerSize = 200,
    top = -120,
    right = -80,
    touchAngle = 45,
    color = colors.accent,
    borderWidth = 2,
    outerOpacity = 0.18,
    innerOpacity = 0.12,
}:TangentCirclesProps)  {
    const outerR = size / 2;
    const innerR = innerSize / 2;
    const diff = outerR - innerR;    
    const centerTop = top + outerR;
    const centerRight = right + outerR;
    const rad = (touchAngle * Math.PI) / 180;
    const dx = diff * Math.cos(rad);           // + = toward the right edge
    const dy = diff * Math.sin(rad);           // + = upward (screen y is inverted)

    const innerTop = centerTop - dy - innerR;
    const innerRight = centerRight - dx - innerR;
    console.log(rad)
    return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={{
        position: "absolute",
        top, right,
        width: size, height: size, borderRadius: outerR,
        borderWidth, borderColor: color, opacity: outerOpacity,
      }} />
      <View style={{
        position: "absolute",
        top: innerTop, right: innerRight,
        width: innerSize, height: innerSize, borderRadius: innerR,
        borderWidth, borderColor: color, opacity: innerOpacity,
      }} />
    </View>
  );
}   

export default TangentCircles