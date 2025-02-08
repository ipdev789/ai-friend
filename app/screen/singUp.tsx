import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const SignUpScreen: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpInput && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResendOtp(true);
    }
    return () => clearTimeout(timer);
  }, [showOtpInput, countdown]);

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

  const validatePasswordStrength = (password: string) => {
    let strength = '';
    if (password.length >= 8) {
      if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        strength = 'Strong';
      } else if (/[A-Z]/.test(password) || /[a-z]/.test(password) || /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) {
        strength = 'Medium';
      } else {
        strength = 'Weak';
      }
    } else {
      strength = 'Weak';
    }
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    validatePasswordStrength(password);
  };

  const handleCreateAccount = () => {
    if (!email || !phone || !password || !cpassword || !username) {
      Alert.alert("Error", "Please fill all the fields.");
    } else if (password !== cpassword) {
      Alert.alert("Error", "Passwords do not match.");
    } else if (!isEmailValid) {
      Alert.alert("Error", "Please enter a valid email address.");
    } else if (!isPhoneValid) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
    } else {
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(randomOtp);
      setShowOtpInput(true);
      setCountdown(60);
      setCanResendOtp(false);
      Alert.alert("OTP Sent", `Your OTP is: ${randomOtp}`); // For testing
      Alert.alert("OTP Sent", "An OTP has been sent to your email/phone.");
    }
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      Alert.alert("Success", "Account created successfully!");
      router.push('/'); // Redirect to the index page
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = () => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setCountdown(60);
    setCanResendOtp(false);
    Alert.alert("OTP Sent", `Your OTP is: ${randomOtp}`); // For testing
    Alert.alert("OTP Sent", "An OTP has been sent to your email/phone.");
  };

  const handleSignInRedirect = () => {
    router.push('/'); // Redirect to the index page
  };

  const isFormValid = () => {
    return (
      username &&
      fullName &&
      password &&
      cpassword &&
      isEmailValid &&
      email &&
      isPhoneValid &&
      phone.length === 10 &&
      password === cpassword
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your AI Companion</Text>
        <Text style={styles.subtitle}>Start your journey with a personalized AI friend.</Text>
      </View>
      <View style={styles.formContainer}>
        {!showOtpInput ? (
          <>
            <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
            <TextInput placeholder="Full Name" style={styles.input} value={fullName} onChangeText={setFullName} />
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
            <View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="black" />
                </TouchableOpacity>
              </View>
              {password.length > 0 && (
                <Text style={[styles.passwordStrength, passwordStrength === 'Strong' ? styles.strong : passwordStrength === 'Medium' ? styles.medium : styles.weak]}>
                  Password Strength: {passwordStrength}
                </Text>
              )}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={!showCPassword}
                  style={styles.input}
                  value={cpassword}
                  onChangeText={setCPassword}
                />
                <TouchableOpacity style={styles.icon} onPress={() => setShowCPassword(!showCPassword)}>
                  <Ionicons name={showCPassword ? 'eye-off' : 'eye'} size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={[styles.button, !isFormValid() && styles.buttonDisabled]} onPress={handleCreateAccount} disabled={!isFormValid()}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignInRedirect}>
              <Text style={styles.signInText}>
                Already have an account? <Text style={styles.signInLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.otpText}>Enter OTP sent to your email/phone:</Text>
            <TextInput placeholder="Enter OTP" keyboardType="number-pad" style={styles.input} value={otp} onChangeText={setOtp} />
            <TouchableOpacity style={styles.button} onPress={canResendOtp ? handleResendOtp : handleVerifyOtp}>
              <Text style={styles.buttonText}>{canResendOtp ? 'Resend OTP' : 'Verify OTP'}</Text>
            </TouchableOpacity>
            <Text style={styles.countdownText}>Time remaining: {countdown} seconds</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4B0082" },
  contentContainer: { padding: 16 },
  header: { flex: 1, alignItems: "center", marginVertical: 30 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#fff", textAlign: "center", marginTop: 8 },
  formContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 20, elevation: 10 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: "#f9f9f9", flex: 1,
    paddingRight: 40,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  button: { backgroundColor: "#4B0082", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonDisabled: { backgroundColor: "#999" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  otpText: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  passwordStrength: {
    marginTop: 5,
    fontSize: 14,
  },
  strong: {
    color: 'green',
  },
  medium: {
    color: 'orange',
  },
  weak: {
    color: 'red',
  },
  signInText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#4B0082',
  },
  signInLink: {
    fontWeight: 'bold',
    color: '#4B0082',
  },
  countdownText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#4B0082',
  },
});

export default SignUpScreen;