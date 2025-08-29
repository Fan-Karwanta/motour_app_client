
import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { Search, Sliders } from "lucide-react-native";
import Colors from "@/constants/colors";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onFilter?: () => void;
}

const SearchBar = ({
  placeholder = "Search here...",
  onSearch,
  onFilter,
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          onChangeText={onSearch}
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilter}>
        <Sliders size={20} color={Colors.buttonText} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});

export default SearchBar;
