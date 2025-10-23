import { useRouter } from "expo-router"; // 👈 for navigation
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image
          source={require("@/assets/icons/chevron-left.png")}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
        >
          <View style={styles.topContainer}>
            <Image
              source={require("@/assets/png/mega-fitness-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formWrapper}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>Sign up to your Account</Text>

              <View style={styles.inputGroup}>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#8e8e8e"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor="#8e8e8e"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#8e8e8e"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showText}>
                    {showPassword ? "hide" : "show"}
                  </Text>
                </TouchableOpacity>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => router.push("/otp")}
              >
                <Text style={styles.signInText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
  },
  topContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    marginBottom: -10,
  },
  logo: {
    width: 160,
    height: 160,
  },
  formWrapper: {
    flex: 0.3,
    backgroundColor: "#180921",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingBottom: 60,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    marginTop: 8,
    marginBottom: 25,
    fontSize: 15,
  },
  inputGroup: {
    position: "relative",
    width: "100%",
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#2A2134",
    color: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
  },
  showButton: {
    position: "absolute",
    right: 15,
    top: 14,
  },
  showText: {
    fontSize: 18,
    textDecorationLine: "underline",
    color: "#aaa",
  },
  signInButton: {
    backgroundColor: "#2AA8A8",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 10,
    textAlign: "center",
  },
});
