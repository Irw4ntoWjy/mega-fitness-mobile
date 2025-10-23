import { saveSession } from "@/lib/session";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
      if (err.errors) setError(err.errors[0].message);
      else setError("An unexpected error occurred");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black will-change-variable">
      <KeyboardAvoidingView
        className="flex-1 will-change-variable"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 will-change-variable"
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
        >
          {/* Logo */}
          <View className="flex-[0.7] justify-center items-center bg-black mb-[-10] will-change-variable">
            <Image
              source={require("@/assets/png/mega-fitness-logo.png")}
              className="w-40 h-40 will-change-variable"
              resizeMode="contain"
            />
          </View>

          {/* Form section */}
          <View className="flex-[0.3] bg-[#180921] rounded-t-[50px] justify-center will-change-variable">
            <View className="px-6 pb-16 items-center justify-end will-change-variable">
              <Text className="text-white text-2xl font-bold will-change-variable">
                Sign In
              </Text>
              <Text className="text-gray-400 mt-2 mb-6 text-base will-change-variable">
                Sign in to your Account
              </Text>

              {/* Email input */}
              <View className="relative w-full mb-4 will-change-variable">
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor="#8e8e8e"
                  className="bg-[#2A2134] text-white rounded-xl py-3.5 px-4 text-base will-change-variable"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password input */}
              <View className="relative w-full mb-4 will-change-variable">
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#8e8e8e"
                  secureTextEntry={!showPassword}
                  className="bg-[#2A2134] text-white rounded-xl py-3.5 px-4 text-base will-change-variable"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-3.5 will-change-variable"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text className="text-gray-400 underline text-lg will-change-variable">
                    {showPassword ? "hide" : "show"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Error */}
              {error && (
                <Text className="text-[#ff6b6b] mb-2 text-center will-change-variable">
                  {error}
                </Text>
              )}

              {/* Sign in button */}
              <TouchableOpacity
                className="bg-[#2AA8A8] w-full py-3.5 rounded-xl items-center mt-2 will-change-variable"
                onPress={handleLogin}
              >
                <Text className="text-white text-lg font-semibold will-change-variable">
                  Sign In
                </Text>
              </TouchableOpacity>

              {/* Footer */}
              <Text className="text-gray-300 mt-6 text-sm will-change-variable">
                Haven’t got an account yet?{" "}
                <Text
                  className="text-white font-semibold underline will-change-variable"
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
