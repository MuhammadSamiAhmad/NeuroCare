import type React from "react"
import { View, TextInput, Text, StyleSheet, type ViewStyle, type TextInputProps } from "react-native"
import { colors } from "../../theme/colors"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerStyle?: ViewStyle
}

export const Input: React.FC<InputProps> = ({ label, error, leftIcon, rightIcon, containerStyle, style, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error && styles.inputError]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
            style,
          ]}
          placeholderTextColor={colors.textLight}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
})
