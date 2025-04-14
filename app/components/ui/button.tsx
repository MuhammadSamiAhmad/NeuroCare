import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  type TouchableOpacityProps,
} from "react-native"
import { colors } from "../../theme/colors"

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: "primary" | "outline" | "ghost"
  size?: "small" | "medium" | "large"
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "outline":
        return styles.buttonOutline
      case "ghost":
        return styles.buttonGhost
      default:
        return styles.buttonPrimary
    }
  }

  const getButtonSizeStyle = () => {
    switch (size) {
      case "small":
        return styles.buttonSmall
      case "large":
        return styles.buttonLarge
      default:
        return styles.buttonMedium
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.textOutline
      case "ghost":
        return styles.textGhost
      default:
        return styles.textPrimary
    }
  }

  const getTextSizeStyle = () => {
    switch (size) {
      case "small":
        return styles.textSmall
      case "large":
        return styles.textLarge
      default:
        return styles.textMedium
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), getButtonSizeStyle(), disabled && styles.buttonDisabled, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "white" : colors.primary} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.textDisabled,
              leftIcon ? { marginLeft: 8 } : undefined,
              rightIcon ? { marginRight: 8 } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonGhost: {
    backgroundColor: "transparent",
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  textPrimary: {
    color: "white",
  },
  textOutline: {
    color: colors.primary,
  },
  textGhost: {
    color: colors.primary,
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
  textDisabled: {
    opacity: 0.7,
  },
})
