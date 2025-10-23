import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OtpVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleSignUp = () => {
    const code = otp.join("");
    console.log("Entered OTP:", code);
    // TODO: Verify OTP logic
  };

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
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/png/mega-fitness-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* OTP Form Section */}
        <View style={styles.formWrapper}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>Please Check your OTP</Text>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpBox}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
  logoContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  formWrapper: {
    flex: 0.7,
    backgroundColor: "#180921",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#aaa",
    marginTop: 6,
    marginBottom: 25,
    fontSize: 15,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 60,
    marginTop: 60,
  },
  otpBox: {
    backgroundColor: "#2A2134",
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    borderRadius: 10,
    width: 50,
    height: 55,
  },
  signUpButton: {
    backgroundColor: "#2AA8A8",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
  },
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
