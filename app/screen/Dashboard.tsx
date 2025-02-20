import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Modal, Animated, Dimensions, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Use useRouter from expo-router

// Define the Message type
interface Message {
  role: 'user' | 'ai';
  content: string;
  isVoice: boolean;
}

const Dashboard = ({ route }: { route: any }) => {
  const router = useRouter();  // Using useRouter from expo-router
  const { selectedAvatar, avatarName, age, gender, personality } = route?.params || {};
  const [messages, setMessages] = useState<Message[]>([]);  // Use the Message type for state
  const [input, setInput] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = (content: string, isVoice: boolean) => {
    if (content.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content, isVoice }]);
      setTimeout(() => {
        const aiResponse = `I received your ${isVoice ? 'voice' : 'text'} message: "${content}". How can I assist you further?`;
        setMessages((prev) => [...prev, { role: 'ai', content: aiResponse, isVoice }]);
      }, 1000);
    }
    setInput('');
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceContent = 'This is a simulated voice input.';
      handleSendMessage(voiceContent, true);
    }, 3000);
  };

  const toggleChatMode = () => {
    setIsVoiceMode((prev) => !prev);
    if (!isVoiceMode) {
      setTimeout(() => textInputRef.current?.focus(), 100);
    }
  };

  const handleSettings = () => {
    setIsSettingsVisible(true);
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').width / 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSettings = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsSettingsVisible(false));
  };

  const handleDeleteChatHistory = () => {
    // Add logic to delete chat history
    Alert.alert('Chat History Deleted', 'Your chat history has been successfully deleted.');
  };

  const handleManageLinkedAccounts = () => {
    // Add logic to manage linked accounts
    Alert.alert('Manage Linked Accounts', 'Here you can manage your linked accounts.');
  };

  const handleChangePassword = () => {
    // Add logic to change password
    Alert.alert('Change Password', 'Here you can change your password.');
  };

  // Handle delete account
    const handleDeleteAccount = () => {
      Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => Alert.alert('Account Deleted', 'Your account has been successfully deleted.') },
      ]);
      // Add logic to delete account, e.g., API call
    };
  const handleAvatarCreation = () => {
    router.push('/screen/avatarCreation');
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>AI Companion Dashboard</Text>
          <TouchableOpacity onPress={handleSettings} style={styles.navigationButton}>
            <Ionicons name="settings" size={25} color="#540681" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.avatarSection}>
            <Avatar
              size="large"
              rounded
              source={selectedAvatar ? { uri: selectedAvatar } : require('E:\\InventPrime\\ai-friend\\assets\\male1.jpg')}
              overlayContainerStyle={styles.avatar}
            />
            <Text style={styles.aiText}>{avatarName || 'Your AI Companion'}</Text>
            <Text style={styles.aiDescription}>{`I am a ${age}-year-old ${gender} with a ${personality} personality.`}</Text>
            <TouchableOpacity onPress={toggleChatMode} style={styles.button}>
              <Text style={styles.buttonText}>
                {isVoiceMode ? 'Switch to Text Chat' : 'Switch to Voice Chat'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView ref={scrollViewRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
            {messages.map((message, index) => (
              <View key={index} style={[styles.message, message.role === 'user' ? styles.userMessage : styles.aiMessage]}>
                <Avatar size="small" rounded title={message.role === 'user' ? 'U' : 'A'} />
                <View style={styles.messageContent}>
                  {message.isVoice && <Ionicons name="mic" size={16} color="gray" />}
                  <Text style={styles.messageText}>{message.content}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            {isVoiceMode ? (
              <TouchableOpacity onPress={handleVoiceInput} style={[styles.recordButton, isRecording ? styles.recording : {}]} disabled={isRecording}>
                <Ionicons name={isRecording ? 'mic-off' : 'mic'} size={20} color="white" />
                <Text style={styles.recordButtonText}>{isRecording ? 'Recording...' : 'Speak'}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TextInput
                  ref={textInputRef}
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={() => handleSendMessage(input, false)}
                  placeholder="Type your message..."
                  placeholderTextColor="#540681"
                />
                <TouchableOpacity onPress={() => handleSendMessage(input, false)} style={styles.sendButton}>
                  <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Settings Button */}
      <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
        <Ionicons name="settings" size={30} color="white" />
      </TouchableOpacity>

      {/* Settings Modal */}
      <Modal
        transparent={true}
        visible={isSettingsVisible}
        animationType="none"
        onRequestClose={closeSettings}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeSettings}>
          <Animated.View style={[styles.settingsContainer, { left: slideAnim }]}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity onPress={handleDeleteChatHistory} style={styles.option}>
              <Text style={styles.optionText}>Delete Chat History</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleManageLinkedAccounts} style={styles.option}>
              <Text style={styles.optionText}>Manage Linked Accounts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChangePassword} style={styles.option}>
              <Text style={styles.optionText}>Change Password</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.option} onPress={handleAvatarCreation}>
                      <Text style={styles.optionText}>Go to Avatar Creation</Text>
                    </TouchableOpacity>
            
            <TouchableOpacity onPress={handleDeleteAccount} style={[styles.option, styles.deleteOption]}>
              <Text style={[styles.optionText, styles.deleteOptionText]}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeSettings} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#540681" />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#540681',
    padding: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#540681',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#540681',
  },
  navigationButton: {
    padding: 10,
    marginRight: 6,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#540681',
  },
  aiText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#540681',
    textAlign: 'center',
  },
  aiDescription: {
    textAlign: 'center',
    color: '#540681',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#540681',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
    marginVertical: 16,
    backgroundColor: 'rgba(83, 4, 143, 0.76)',
    borderRadius: 15,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageContent: {
    maxWidth: '75%',
    backgroundColor: 'rgba(83, 4, 143, 0.76)',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#e1bee7',
    borderRadius: 8,
    padding: 12,
    color: '#540681',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#540681',
  },
  sendButton: {
    backgroundColor: '#540681',
    padding: 12,
    borderRadius: 50,
    marginLeft: 8,
  },
  recordButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#540681',
  },
  recording: {
    backgroundColor: '#d32f2f',
  },
  recordButtonText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 16,
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsContainer: {
    width: '50%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
    top: 0,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#540681',
    marginBottom: 20,
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
  deleteOption: {
    backgroundColor: '#ffcccc',
  },
  deleteOptionText: {
    color: '#d32f2f',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default Dashboard;