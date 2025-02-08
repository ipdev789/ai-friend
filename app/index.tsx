import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SignInScreen: React.FC = () => {
  const [isEmail, setIsEmail] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const toggleSwitch = () => {
    Animated.timing(slideAnim, {
      toValue: isEmail ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
    setIsEmail(!isEmail);
  };

  const handleSignIn = () => {
    if (isEmail && (!email || !password)) {
      Alert.alert("Error", "Please enter your email and password.");
    } else if (!isEmail && (!phone || !password)) {
      Alert.alert("Error", "Please enter your phone number and password.");
    } else if (isEmail && !isEmailValid) {
      Alert.alert("Error", "Please enter a valid email address.");
    } else if (!isEmail && !isPhoneValid) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
    } else {
      Alert.alert("Success", "Signed in successfully!");
      router.push("./screen/avatarCreation");
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
    setIsEmailValid(validateEmail(email));
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (phone: string) => {
    setPhone(phone);
    setIsPhoneValid(validatePhone(phone));
  };

  const handleForgotPassword = () => {
    router.push("./screen/forgotPassword");
  };

  const handleSignUpRedirect = () => {
    router.push("./screen/singUp");
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Redirecting to Google login...");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey with your AI Companion.</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Sign In</Text>
        <Text style={styles.formSubtitle}>Enter your credentials below</Text>
        {/* Sliding Toggle Button */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleBackground}>
            <Animated.View
              style={[
                styles.toggleSlider,
                {
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 100], // Adjust for the width of each option
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
          <TouchableOpacity style={styles.toggleOption} onPress={() => !isEmail && toggleSwitch()}>
            <Text style={[styles.toggleText, isEmail && styles.activeToggleText]}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleOption} onPress={() => isEmail && toggleSwitch()}>
            <Text style={[styles.toggleText, !isEmail && styles.activeToggleText]}>Phone</Text>
          </TouchableOpacity>
        </View>
        {!isEmail && (
          <View>
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              style={[styles.input, !isPhoneValid && styles.inputError]}
              value={phone}
              onChangeText={handlePhoneChange}
            />
            {!isPhoneValid && <Text style={styles.errorText}>Please enter a valid 10-digit phone number.</Text>}
          </View>
        )}
        {isEmail && (
          <View>
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              style={[styles.input, !isEmailValid && styles.inputError]}
              value={email}
              onChangeText={handleEmailChange}
            />
            {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email address.</Text>}
          </View>
        )}
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>OR CONTINUE WITH</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <FontAwesome name="google" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSignUpRedirect}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B0082",
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
    textAlign: "center",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  toggleBackground: {
    position: "absolute",
    backgroundColor: "#ddd",
    height: 40,
    width: 200,
    borderRadius: 20,
  },
  toggleSlider: {
    position: "absolute",
    height: 40,
    width: 100,
    backgroundColor: "#4B0082",
    borderRadius: 20,
    zIndex: 1,
  },
  toggleOption: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  toggleText: {
    color: "#666",
    fontWeight: "bold",
  },
  activeToggleText: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  button: {
    backgroundColor: "#4B0082",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgotPasswordText: {
    textAlign: "right",
    color: "#4B0082",
    fontSize: 14,
    marginBottom: 16,
  },
  orText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  socialIcon: {
    marginHorizontal: 16,
    backgroundColor: "#4B0082",
    padding: 8,
    borderRadius: 24,
  },
  socialButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4B0082",
    padding: 12,
    borderRadius: 24,
  },
  signUpText: {
    textAlign: "center",
    color: "#666",
  },
  signUpLink: {
    color: "#4B0082",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default SignInScreen;