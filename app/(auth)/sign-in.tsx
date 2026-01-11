import { BackgroundGlow } from "@/components/Theme/background";
import { saveSession } from "@/lib/session";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
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
import { z } from "zod";

const signInSchema = z.object({
  email: z
    .string()
    .refine((val) => val === "admin", { message: "Invalid email or password" }),
  password: z
    .string()
    .refine((val) => val === "admin", { message: "Invalid email or password" }),
});

function InputBox({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-gray-50   border border-gray-300 rounded-lg px-3 py-3">
      {children}
    </View>
  );
}

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      // signInSchema.parse({ email, password });
      await saveSession("admin", "true");
      router.replace("/");
    } catch (err: any) {
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <BackgroundGlow showText={true} />

        <View className="flex-1">
          <View className="flex-1 justify-center items-center">
            <Image
              source={require("@/assets/png/mega-fitness-logo.png")}
              className="w-40 h-40"
              resizeMode="contain"
            />
          </View>

          <View className="bg-[#FFF] rounded-[30px] p-6 m-4">
            <Text className="text-black text-2xl font-bold mb-4">
              Welcome Back!
            </Text>

            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">
                Email or Phone Number
              </Text>
              <InputBox>
                <TextInput
                  placeholder="Enter Email or Phone Number"
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

              <Text className="text-black text-md font-medium text-right">
                Forgot Password
              </Text>
            </View>

            {error && (
              <Text className="text-[#ff6b6b] mb-2 text-center">{error}</Text>
            )}

            <TouchableOpacity
              className="bg-[#259AAA] w-full py-3.5 rounded-xl items-center mt-1"
              onPress={handleLogin}
            >
              <Text className="text-white text-base font-medium">Sign In</Text>
            </TouchableOpacity>

            <Text className="text-black mt-2 text-base text-center">
              Don't have an account yet?{" "}
              <Text
                className="text-black font-semibold underline"
                onPress={() => router.push("/sign-up")}
              >
                Register
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
