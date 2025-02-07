import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const maleAvatars = [
  { id: 'male1', src: require('../../assets/male1.jpg') },
  { id: 'male2', src: require('../../assets/male2.png') },
  { id: 'male3', src: require('../../assets/male3.png') },
  { id: 'male4', src: require('../../assets/male4.png') },
  { id: 'male5', src: require('../../assets/male5.png') },
];

const femaleAvatars = [
  { id: 'female1', src: require('../../assets/female1.png') },
  { id: 'female2', src: require('../../assets/female2.png') },
  { id: 'female3', src: require('../../assets/female3.jpg') },
  { id: 'female4', src: require('../../assets/female4.jpg') },
];

const AvatarCustomization = () => {
  const router = useRouter();
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('female');
  const [selectedAvatar, setSelectedAvatar] = useState(femaleAvatars[0].id);
  const [avatarName, setAvatarName] = useState('');
  const [personality, setPersonality] = useState('Friendly'); // New state for personality

  const getAvatarOptions = () => (gender === 'male' ? maleAvatars : femaleAvatars);

  const handleSaveChanges = () => {
    if (!avatarName.trim()) {
      Alert.alert('Error', 'Please give your AI companion a name!');
    } else if (age < 18) {
      Alert.alert('Error', 'Please select a valid age!');
    } else if (!gender) {
      Alert.alert('Error', 'Please select a gender!');
    } else {
      Alert.alert('Success', 'Proceeding to Dashboard!');

      router.push({
        pathname: '/screen/Dashboard',
        params: {
          selectedAvatar: getAvatarOptions().find(a => a.id === selectedAvatar)?.src.uri,
          avatarName,
          age,
          gender,
          personality, // Passing personality as part of the params
        },
      });
    }
  };

  const currentAvatarSrc = getAvatarOptions().find(a => a.id === selectedAvatar)?.src;

  let lastTap: number | null = null;
  const handleAvatarPress = () => {
    const now = Date.now();
    if (lastTap && (now - lastTap) < 300) {
      const currentIndex = getAvatarOptions().findIndex(a => a.id === selectedAvatar);
      const nextIndex = (currentIndex + 1) % getAvatarOptions().length;
      setSelectedAvatar(getAvatarOptions()[nextIndex].id);
    } else {
      lastTap = now;
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        // Swiped right
        const currentIndex = getAvatarOptions().findIndex(a => a.id === selectedAvatar);
        const nextIndex = (currentIndex + 1) % getAvatarOptions().length;
        setSelectedAvatar(getAvatarOptions()[nextIndex].id);
      } else if (gestureState.dx < -50) {
        // Swiped left
        const currentIndex = getAvatarOptions().findIndex(a => a.id === selectedAvatar);
        const prevIndex = (currentIndex - 1 + getAvatarOptions().length) % getAvatarOptions().length;
        setSelectedAvatar(getAvatarOptions()[prevIndex].id);
      }
    },
  });

  const handleGenderChange = (newGender: string) => {
    setGender(newGender);
    setSelectedAvatar(newGender === 'male' ? maleAvatars[0].id : femaleAvatars[0].id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Customize Your AI Avatar</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer} {...panResponder.panHandlers}>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image source={currentAvatarSrc} style={styles.avatarImage} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Give your AI a name"
            value={avatarName}
            onChangeText={setAvatarName}
            placeholderTextColor="#A78BFA"
          />
        </View>

        <Text style={styles.label}>Age: {age} years</Text>
        <Slider
          value={age}
          onValueChange={setAge}
          minimumValue={18}
          maximumValue={60}
          step={1}
          style={styles.slider}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="female"
              status={gender === 'female' ? 'checked' : 'unchecked'}
              onPress={() => handleGenderChange('female')}
            />
            <Text style={styles.radioLabel}>Female</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="male"
              status={gender === 'male' ? 'checked' : 'unchecked'}
              onPress={() => handleGenderChange('male')}
            />
            <Text style={styles.radioLabel}>Male</Text>
          </View>
        </View>

        {/* Personality Dropdown */}
        <Text style={styles.label}>Personality</Text>
        <Picker
          selectedValue={personality}
          style={styles.picker}
          onValueChange={(itemValue) => setPersonality(itemValue)}
        >
          <Picker.Item label="Friendly" value="Friendly" />
          <Picker.Item label="Serious" value="Serious" />
          <Picker.Item label="Fun" value="Fun" />
          <Picker.Item label="Motivational" value="Motivational" />
        </Picker>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#540681',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#540681',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#540681',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#540681',
    marginBottom: 10,
  },
  slider: {
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    color: '#540681',
    marginLeft: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#540681',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AvatarCustomization;