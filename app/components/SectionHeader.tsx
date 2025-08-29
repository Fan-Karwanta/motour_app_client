
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Colors from "@/constants/colors";

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
}

const SectionHeader = ({ title, onViewAll }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
});

export default SectionHeader;
