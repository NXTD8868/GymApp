import { Ionicons } from "@expo/vector-icons"
import { colors,spacing,fonts } from "@/constants/theme"
import { Modal } from "react-native"
import { Text,Pressable,View } from "react-native"
import { Card} from "./card"
type ConfirmDialogProps = {
  visible: boolean
  icon?: keyof typeof Ionicons.glyphMap   // e.g. 'warning', 'checkmark-circle', 'trash'
  title: string
  description?: string
  confirmLabel: string
  cancelLabel: string
  destructive?: boolean          // red confirm button for dangerous actions
  onConfirm: () => void
  onCancel: () => void
  children?: React.ReactNode     // optional slot for extra content (M2's stat tiles)
}

export function ConfirmDialog({
  visible, icon, title, description,
  confirmLabel, cancelLabel, destructive = false,
  onConfirm, onCancel, children,
}: ConfirmDialogProps) {
  const confirmColor = destructive ? colors.danger : colors.accent

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      {/* dim backdrop; tapping it cancels */}
      <Pressable
        onPress={onCancel}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.lg }}
      >
        {/* stop taps on the card from closing */}
        <Pressable onPress={() => {}}>
          <Card style={{ gap: spacing.md, alignItems: 'center', padding: spacing.lg }}>
            {icon && <Ionicons name={icon} size={48} color={confirmColor} />}

            <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 24, color: colors.text, textAlign: 'center' }}>
              {title}
            </Text>

            {description && (
              <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>
                {description}
              </Text>
            )}

            {children}

            <View style={{ flexDirection: 'row', gap: spacing.sm, width: '100%' }}>
              <Card onPress={onCancel} style={{ flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.surfaceRaised }}>
                <Text style={{ fontFamily: fonts.bodyBold, color: colors.text }}>{cancelLabel}</Text>
              </Card>
              <Card onPress={onConfirm} style={{ flex: 1, alignItems: 'center', backgroundColor: confirmColor }}>
                <Text style={{ fontFamily: fonts.bodyBold, color: colors.background }}>{confirmLabel}</Text>
              </Card>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  )
}