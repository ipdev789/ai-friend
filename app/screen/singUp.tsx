import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";

const SignUpScreen: React.FC = () => {
  const [isEmail, setIsEmail] = useState(true);
  const [fullName, setFullName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleCreateAccount = () => {
    if (isEmail && (!email || !password || !cpassword || !username)) {
      Alert.alert("Error", "Please fill all the fields.");
    } else if (!isEmail && (!phone || !password || !cpassword || !username)) {
      Alert.alert("Error", "Please fill all the fields.");
    } else {
      Alert.alert("Success", "Account created successfully!");
      router.push("//index"); // Redirect to Sign In page after account creation
    }
  };

  const handleSignInRedirect = () => {
    router.push("//index"); // Redirect to Sign In page
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your AI Companion</Text>
        <Text style={styles.subtitle}>Start your journey with a personalized AI friend, mentor, and assistant.</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Create Account</Text>
        <Text style={styles.formSubtitle}>Enter your details to get started</Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => setIsEmail(true)}>
            <Text style={[styles.switchOption, isEmail && styles.activeSwitchOption]}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEmail(false)}>
            <Text style={[styles.switchOption, !isEmail && styles.activeSwitchOption]}>Phone</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
        {/* <TextInput
          placeholder="Last Name"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        /> */}
        {!isEmail && (
          <TextInput
            placeholder="Phone number"
            keyboardType="phone-pad"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
        )}
        {isEmail && (
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        )}
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          value={cpassword}
          onChangeText={setCPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignInRedirect}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign In</Text>
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
    flex: 1,
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  switchOption: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    color: "#666",
  },
  activeSwitchOption: {
    backgroundColor: "#4B0082",
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
  signInText: {
    textAlign: "center",
    color: "#666",
  },
  signInLink: {
    color: "#4B0082",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
