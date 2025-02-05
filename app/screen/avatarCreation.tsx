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

const avatarOptions = [
  { id: 'avatar1', src: require('../../assets/avatar1.png') },
  { id: 'avatar2', src: require('../../assets/avatar2.jpg') },
  { id: 'avatar3', src: require('../../assets/avatar3.png') },
  { id: 'avatar4', src: require('../../assets/avatar4.png') },
  { id: 'avatar5', src: require('../../assets/avatar5.jpg') },
];

const AvatarCustomization = () => {
  const router = useRouter();
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('female');
  // const [voice, setVoice] = useState('female');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].id);
  const [avatarName, setAvatarName] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [customAvatarsCount, setCustomAvatarsCount] = useState(0);
  const [avatarOptionsState, setAvatarOptions] = useState(avatarOptions);

  const handleAvatarUpload = async () => {
    if (customAvatarsCount >= 5) {
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
        id: `avatar${avatarOptionsState.length + 1}`,
        src: { uri: result.assets[0].uri },
      };

      setAvatarOptions([...avatarOptionsState, newAvatar]);
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
    // } else if (!voice) {
    //   Alert.alert('Error', 'Please select a voice!');
    } else {
      Alert.alert('Success', 'Proceeding to Dashboard!');

      // Navigate to the Dashboard page using router.push
      router.push({
        pathname: '/screen/Dashboard',
        params: {
          selectedAvatar: avatarOptionsState.find(a => a.id === selectedAvatar)?.src.uri,
          avatarName,
          age,
          gender,
          // voice,
        },
      });
      
      
    }
    console.log('Save changes:', { selectedAvatar, avatarName, age, gender });
    // console.log('Save changes:', { selectedAvatar, avatarName, age, gender, voice });
  };

  const currentAvatarSrc = avatarOptionsState.find(a => a.id === selectedAvatar)?.src;

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
          {avatarOptionsState.map(avatar => (
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
          <TouchableOpacity style={styles.customButton} onPress={() => setShowOptions(true)}>
            <Ionicons name="image" size={24} color="#7C3AED" />
            <Text style={styles.customText}>Custom</Text>
          </TouchableOpacity>
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
{/* 
        <Text style={styles.label}>Voice Type</Text>
        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="female"
              status={voice === 'female' ? 'checked' : 'unchecked'}
              onPress={() => setVoice('female')}
            />
            <Text style={styles.radioLabel}>Female Voice</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="male"
              status={voice === 'male' ? 'checked' : 'unchecked'}
              onPress={() => setVoice('male')}
            />
            <Text style={styles.radioLabel}>Male Voice</Text>
          </View>
        </View> */}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showOptions} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={handleAvatarUpload}>
              <Text style={styles.modalOptionText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => setShowOptions(false)}>
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  customButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#540681',
    borderRadius: 25,
    marginLeft: 10,
  },
  customText: {
    fontSize: 10,
    color: '#540681',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#7C3AED',
  },
});

export default AvatarCustomization;