import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText'; // Correct import statement//+
import {ThemedView } from '../components/ThemedView'; // Ensure this path is correct

const NotFound = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Page Not Found</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default NotFound;
