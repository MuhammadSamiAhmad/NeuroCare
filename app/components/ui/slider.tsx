"use client"

import type React from "react"
import { View, StyleSheet, Text } from "react-native"
import Slider from "@react-native-community/slider"
import { colors } from "../../theme/colors"

interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
  disabled?: boolean
  label?: string
  showValue?: boolean
}

export const CustomSlider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  disabled = false,
  label,
  showValue = false,
}) => {
  return (
    <View style={styles.container}>
      {(label || showValue) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValue && <Text style={styles.value}>{value}</Text>}
        </View>
      )}

      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        disabled={disabled}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  slider: {
    width: "100%",
    height: 40,
  },
})

export { CustomSlider as Slider }
