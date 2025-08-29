
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Colors from "@/constants/colors";

interface CategoryItemProps {
  name: string;
  image: string;
  onPress: () => void;
}

const CategoryItem = ({ name, image, onPress }: CategoryItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    backgroundColor: Colors.backgroundAlt,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.text,
    fontWeight: "500",
  },
});

export default CategoryItem;
