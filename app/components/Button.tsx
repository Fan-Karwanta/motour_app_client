
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import Colors from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton;
      case "outline":
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outlineText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : Colors.buttonText}
        />
      ) : (
        <Text
          style={[getTextStyle(), disabled && styles.disabledText, textStyle]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.backgroundAlt,
    borderColor: Colors.border,
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: "600",
  },
  outlineText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledText: {
    color: Colors.textLight,
  },
});

export default Button;
