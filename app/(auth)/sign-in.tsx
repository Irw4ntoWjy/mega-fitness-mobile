import { saveSession } from "@/lib/session";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
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
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().refine((val) => val === "admin"),
  password: z.string().refine((val) => val === "admin"),
});
const { height } = Dimensions.get("window");

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      signInSchema.parse({ email, password });
      await saveSession("admin", "true");
      router.replace("/");
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Sign in to your Account</Text>

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
                onPress={handleLogin}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>

              <Text style={styles.footerText}>
                Haven’t got an account yet?{" "}
                <Text
                  style={styles.registerText}
                  onPress={() => router.push("/sign-up")}
                >
                  Register
                </Text>
              </Text>
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
    alignItems: "center",
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
  footerText: {
    color: "#ccc",
    marginTop: 25,
    fontSize: 14,
  },
  registerText: {
    color: "#fff",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
