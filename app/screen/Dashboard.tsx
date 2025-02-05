import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
  const { selectedAvatar, avatarName, age, gender, voice } = route?.params || {};
  const [messages, setMessages] = useState<Message[]>([]);  // Use the Message type for state
  const [input, setInput] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

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
    router.push('/screen/settings'); // Redirect to settings page
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>AI Companion Dashboard</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.avatarSection}>
            <Avatar
              size="large"
              rounded
              source={selectedAvatar ? { uri: selectedAvatar } : require('../screen/avatarCreation')}
              overlayContainerStyle={styles.avatar}
            />
            <Text style={styles.aiText}>{avatarName || 'Your AI Companion'}</Text>
            <Text style={styles.aiDescription}>{`I am a ${age}-year-old ${gender} with a ${voice} voice.`}</Text>
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
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#540681',
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
});

export default Dashboard;
