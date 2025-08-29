
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Hotel, Plane, Bus, Utensils } from "lucide-react-native";
import Colors from "@/constants/colors";

interface AmenityItemProps {
  type: "hotel" | "flight" | "transport" | "food";
  active?: boolean;
}

const AmenityItem = ({ type, active = true }: AmenityItemProps) => {
  const getIcon = () => {
    const color = active ? Colors.primary : Colors.textLight;

    switch (type) {
      case "hotel":
        return <Hotel size={24} color={color} />;
      case "flight":
        return <Plane size={24} color={color} />;
      case "transport":
        return <Bus size={24} color={color} />;
      case "food":
        return <Utensils size={24} color={color} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (type) {
      case "hotel":
        return "Hotel";
      case "flight":
        return "Flight";
      case "transport":
        return "Transport";
      case "food":
        return "Food";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, !active && styles.inactiveIcon]}>
        {getIcon()}
      </View>
      <Text style={[styles.label, !active && styles.inactiveLabel]}>
        {getLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  inactiveIcon: {
    backgroundColor: Colors.backgroundAlt,
    opacity: 0.6,
  },
  label: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: "500",
  },
  inactiveLabel: {
    color: Colors.textLight,
  },
});

export default AmenityItem;
