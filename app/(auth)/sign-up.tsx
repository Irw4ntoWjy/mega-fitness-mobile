import { BackgroundGlow } from "@/components/Theme/background";
import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
console.log(process.env.EXPO_PUBLIC_BACKEND_URL);

function InputBox({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-gray-50   border border-gray-300 rounded-lg px-3 py-3">
      {children}
    </View>
  );
}

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={"padding"}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Background glow same as login */}
        <BackgroundGlow showText={true} />
        <TouchableOpacity className="mx-4" onPress={() => router.back()}>
          <Pressable
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <ChevronLeft size={22} />
          </Pressable>
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

          <View className="mb-3 gap-2">
            <Text className="text-black text-lg font-medium">Username</Text>
            <InputBox>
              <TextInput
                placeholder="Enter Email or Phone Number"
                placeholderTextColor={"#212121"}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                className="text-gray-900"
              />
            </InputBox>
          </View>

          <View className="mb-3 gap-2">
            <Text className="text-black text-lg font-medium">
              Email or Phone Number
            </Text>
            <InputBox>
              <TextInput
                placeholder="Enter Username"
                placeholderTextColor={"#212121"}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                className="text-gray-900"
              />
            </InputBox>
          </View>

          <View className="mb-3 gap-2">
            <Text className="text-black text-lg font-medium">Password</Text>

            <InputBox>
              <View className="flex flex-row items-center">
                <TextInput
                  placeholder="Enter Password"
                  placeholderTextColor={"#212121"}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 text-gray-900"
                />

                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </Pressable>
              </View>
            </InputBox>
          </View>

          {error && (
            <Text className="text-[#ff6b6b] mb-2 text-center">{error}</Text>
          )}

          <TouchableOpacity
            className="bg-[#259AAA] w-full py-3.5 rounded-xl items-center mt-1"
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
