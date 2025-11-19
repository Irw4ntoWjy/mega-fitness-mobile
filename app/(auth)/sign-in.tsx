import { BackgroundGlow } from "@/components/Theme/background";
import { saveSession } from "@/lib/session";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
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

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword] = useState(false);

  const handleLogin = async () => {
    try {
      signInSchema.parse({ email, password });
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
    <SafeAreaView style={{ flexGrow: 1 }} className="mb-2">
      <BackgroundGlow showText={true} />

      <View className="flex-[0.5] justify-center items-center mb-2.5">
        <Image
          source={require("@/assets/png/mega-fitness-logo.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      <View className="flex-[0.6]  bg-[#FFF] rounded-[30px] overflow-hidden justify-center m-3">
        <View className="px-6 pb-16 gap-2 mt-4">
          <Text className="text-black text-lg font-medium my-4">
            Welcome Back!
          </Text>

          {/* Email */}
          <View className="w-full mb-4 gap-2">
            <Text className="text-black text-md font-medium">
              Email or Phone Number
            </Text>
            <TextInput
              placeholder="Enter Email or Phone Number"
              placeholderTextColor="#000000"
              className="bg-[#EFEEEF] text-black rounded-xl py-3.5 px-4 text-md"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View className="w-full mb-4 gap-2 relative">
            <Text className="text-black text-md font-medium">Password</Text>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#000000"
              secureTextEntry={!showPassword}
              className="bg-[#EFEEEF] text-black rounded-xl py-3.5 px-4 text-md pr-16"
              value={password}
              onChangeText={setPassword}
            />
            <Text className="text-black text-md font-medium text-end items-end">
              Forgot Password
            </Text>
          </View>

          {error && (
            <Text className="text-[#ff6b6b] mb-2.5 text-center">{error}</Text>
          )}

          <TouchableOpacity
            className="bg-[#DAA770] w-full py-3.5 rounded-xl items-center mt-2"
            onPress={handleLogin}
          >
            <Text className="text-white text-md font-medium">Sign In</Text>
          </TouchableOpacity>

          <Text className="text-black mt-3 text-sm items-center text-center">
            Don&apos;t have an account yet?{" "}
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
  );
}
