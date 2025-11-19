import { BackgroundGlow } from "@/components/Theme/background";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
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
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Background glow same as login */}
        <BackgroundGlow showText={true} />
        <TouchableOpacity className="mx-4" onPress={() => router.back()}>
          <Image
            source={require("@/assets/icons/chevron-left.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View className="flex-1 justify-center items-center">
          <Image
            source={require("@/assets/png/mega-fitness-logo.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </View>
        <View className="bg-[#FFF] rounded-[30px] p-6 m-4">
          <Text className="text-black text-2xl font-bold mb-4">
            Create an Account
          </Text>

          {/* Username */}
          <View className="mb-3 gap-2">
            <Text className="text-black text-lg font-medium">Username</Text>
            <TextInput
              placeholder="Enter Username"
              placeholderTextColor="#000000"
              className="bg-[#EFEEEF] text-black rounded-xl py-3.5 px-4 text-base"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Email */}
          <View className="mb-3 gap-2">
            <Text className="text-black text-lg font-medium">
              Email or Phone Number
            </Text>
            <TextInput
              placeholder="Enter Email or Phone Number"
              placeholderTextColor="#000000"
              className="bg-[#EFEEEF] text-black rounded-xl py-3.5 px-4 text-base"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View className="mb-3 gap-2">
            <Text className="text-black text-lg font-medium">Password</Text>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#000000"
              secureTextEntry={!showPassword}
              className="bg-[#EFEEEF] text-black rounded-xl py-3.5 px-4 text-base"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error && (
            <Text className="text-[#ff6b6b] mb-2 text-center">{error}</Text>
          )}

          <TouchableOpacity
            className="bg-[#DAA770] w-full py-3.5 rounded-xl items-center mt-1"
            onPress={() => router.push("/otp")}
          >
            <Text className="text-white text-base font-medium">Sign Up</Text>
          </TouchableOpacity>

          <Text className="text-black mt-3 text-md text-center">
            Already have an account?{" "}
            <Text
              className="font-semibold underline"
              onPress={() => router.push("/sign-in")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
