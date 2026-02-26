import { BackgroundGlow } from "@/components/Theme/background";
import { useToast } from "@/components/Toast/toast-provider";
import { signInSchema } from "@/type/auth";
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
import { login } from "../api/auth";

function InputBox({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3">
      {children}
    </View>
  );
}

export default function SignIn() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("seraganteng@gmail.com");
  const [password, setPassword] = useState("Strong123!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      showToast({
        message: "Email dan password wajib diisi",
        variant: "error",
        duration: 2500,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await login(parsed.data);

      if (!res.success) {
        showToast({
          message: res.message || "Login gagal",
          variant: "error",
          duration: 2500,
        });
        return;
      }

      showToast({
        message: "Sign in berhasil",
        variant: "success",
        duration: 2500,
      });
      router.replace("/");
    } catch (err) {
      showToast({
        message: "Terjadi kesalahan yang tidak terduga",
        variant: "error",
        duration: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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

          <View className="bg-white rounded-[30px] p-6 m-4">
            <Text className="text-black text-2xl font-bold mb-4">
              Selamat datang!
            </Text>

            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">Email</Text>
              <InputBox>
                <TextInput
                  placeholder="Masukkan Email"
                  placeholderTextColor="#212121"
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
                    placeholder="Masukkan Password"
                    placeholderTextColor="#212121"
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

            <TouchableOpacity
              disabled={loading}
              className="bg-[#259AAA] w-full py-3.5 rounded-xl items-center mt-1 opacity-100"
              onPress={handleLogin}
            >
              <Text className="text-white text-base font-medium">
                {loading ? "Sedang masuk..." : "Masuk"}
              </Text>
            </TouchableOpacity>

            <Text className="text-black mt-2 text-base text-center">
              Belum punya akun?{" "}
              <Text
                className="font-semibold underline"
                onPress={() => router.push("/sign-up")}
              >
                Daftar di sini
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
