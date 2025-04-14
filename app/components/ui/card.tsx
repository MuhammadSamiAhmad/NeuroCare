import type React from "react"
import { View, StyleSheet, type ViewStyle, type ViewProps } from "react-native"
import { colors } from "../../theme/colors"

interface CardProps extends ViewProps {
  style?: ViewStyle
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
})
