import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
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
  const [showOptions, setShowOptions] = useState(false);
  const [customAvatarsCount, setCustomAvatarsCount] = useState(0);
  const [personality, setPersonality] = useState('Friendly'); // New state for personality

  const getAvatarOptions = () => (gender === 'male' ? maleAvatars : femaleAvatars);

  const handleAvatarUpload = async () => {
    if (customAvatarsCount >= 8) {
      Alert.alert('Limit Reached', 'You can only upload up to 5 avatars.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newAvatar = {
        id: `avatar${getAvatarOptions().length + 1}`,
        src: { uri: result.assets[0].uri },
      };

      setCustomAvatarsCount(customAvatarsCount + 1);
      setSelectedAvatar(newAvatar.id);
    }
    setShowOptions(false);
  };

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Customize Your AI Avatar</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={currentAvatarSrc} style={styles.avatarImage} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Give your AI a name"
            value={avatarName}
            onChangeText={setAvatarName}
            placeholderTextColor="#A78BFA"
          />
        </View>

        <View style={styles.avatarOptions}>
          {getAvatarOptions().map(avatar => (
            <TouchableOpacity
              key={avatar.id}
              onPress={() => setSelectedAvatar(avatar.id)}
              style={[
                styles.avatarOption,
                selectedAvatar === avatar.id && styles.selectedOption,
              ]}
            >
              <Image source={avatar.src} style={styles.optionImage} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Age: {age} years</Text>
        <Slider
          value={age}
          onValueChange={setAge}
          minimumValue={18}
          maximumValue={100}
          step={1}
          style={styles.slider}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="female"
              status={gender === 'female' ? 'checked' : 'unchecked'}
              onPress={() => setGender('female')}
            />
            <Text style={styles.radioLabel}>Female</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="male"
              status={gender === 'male' ? 'checked' : 'unchecked'}
              onPress={() => setGender('male')}
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
  avatarOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  avatarOption: {
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#540681',
  },
  optionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
