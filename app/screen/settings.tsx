import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const Settings = () => {
  // Handle delete chat history action
  const handleDeleteChatHistory = () => {
    Alert.alert('Chat History Deleted', 'Your chat history has been successfully deleted.', [
      { text: 'OK' },
    ]);
    // Add the logic to delete chat history, e.g., clearing local storage or API call
  };

  // Handle manage linked accounts
  const handleManageLinkedAccounts = () => {
    Alert.alert('Manage Linked Accounts', 'Here you can manage your linked accounts.', [
      { text: 'OK' },
    ]);
    // Add logic to navigate to linked accounts management screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Section 1: Privacy Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Controls</Text>

        {/* Delete Chat History */}
        <TouchableOpacity style={styles.option} onPress={handleDeleteChatHistory}>
          <Text style={styles.optionText}>Delete Chat History</Text>
        </TouchableOpacity>

        {/* Data Security */}
        <View style={styles.option}>
          <Text style={styles.optionText}>Data Security</Text>
        </View>
      </View>

      {/* Section 2: Notification Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        {/* Missed Task */}
        <View style={styles.option}>
          <Text style={styles.optionText}>Missed Task</Text>
        </View>

        {/* Daily Agenda */}
        <View style={styles.option}>
          <Text style={styles.optionText}>Daily Agenda</Text>
        </View>
      </View>

      {/* Section 3: Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        {/* Manage Linked Accounts */}
        <TouchableOpacity style={styles.option} onPress={handleManageLinkedAccounts}>
          <Text style={styles.optionText}>Manage Linked Accounts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#540681',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#540681',
    marginBottom: 10,
  },
  option: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#540681',
  },
});

export default Settings;
