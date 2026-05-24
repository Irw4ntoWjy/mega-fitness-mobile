import { BackgroundGlow } from "@/components/Theme/background";
import { useToast } from "@/components/Toast/toast-provider";
import { getAuth, logout } from "@/lib/auth-storage";
import { otpRequestSchema } from "@/type/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useCallback, useState } from "react";
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
import { login, requestOtp, update_password } from "../api/auth";
// import { resetPassword } from "../api/auth"; // <-- create this API

function InputBox({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3">
      {children}
    </View>
  );
}

export default function ResetPassword() {
  const router = useRouter();

  const { showToast } = useToast();

  const { email } = useLocalSearchParams<{ email: string }>();

  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const isFormValid =
    newPassword &&
    verifyPassword &&
    otp &&
    newPassword === verifyPassword &&
    newPassword.length >= 8;

  const requestOtpOnce = useCallback(async () => {
    const payload = { email: email ?? "" };
    const parsed = otpRequestSchema.safeParse(payload);
    if (!parsed.success) {
      showToast({
        message: parsed.error.issues[0]?.message || "Invalid email",
        variant: "error",
        duration: 2500,
      });
      return false;
    }

    const res = await requestOtp(parsed.data);
    if (!res.success || !res.data) {
      showToast({
        message: res.message || "Failed to request OTP",
        variant: "error",
        duration: 2500,
      });
      return false;
    }
    setCooldownSeconds(60);
    return true;
  }, [email, showToast]);

  const handleResetPassword = async () => {
    const auth = await getAuth();

    if (!isFormValid) {
      showToast({
        message: "Semua field harus valid",
        variant: "error",
      });
      return;
    }

    if (newPassword === "Aa123456") {
      showToast({
        message: "Password terlalu mudah ditebak",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email,
        otp,
        new_password: newPassword,
      };
      console.log(auth);
      if (!auth) {
        await login({ email, password: "Aa123456" });
      }

      const res = await update_password(payload);

      if (!res.success) {
        showToast({
          message: res.message || "Gagal reset password",
          variant: "error",
        });
        return;
      }

      showToast({
        message: "Password berhasil diperbarui",
        variant: "success",
      });
      await logout();

      router.replace("/sign-in");
    } catch (err) {
      showToast({
        message: "Terjadi kesalahan",
        variant: "error",
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
              Reset Password
            </Text>

            {/* New Password */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">
                Password Baru
              </Text>

              <InputBox>
                <View className="flex flex-row items-center">
                  <TextInput
                    placeholder="Masukkan Password Baru"
                    placeholderTextColor={"#6B7280"}
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
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

            {/* Verify Password */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">
                Konfirmasi Password
              </Text>

              <InputBox>
                <View className="flex flex-row items-center">
                  <TextInput
                    placeholder="Ulangi Password"
                    placeholderTextColor={"#6B7280"}
                    secureTextEntry={!showVerify}
                    value={verifyPassword}
                    onChangeText={setVerifyPassword}
                    className="flex-1 text-gray-900"
                  />

                  <Pressable onPress={() => setShowVerify(!showVerify)}>
                    {showVerify ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </Pressable>
                </View>
              </InputBox>
            </View>

            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">OTP</Text>

              <InputBox>
                <TextInput
                  placeholder="Masukkan OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  className="text-gray-900"
                />
              </InputBox>

              <TouchableOpacity
                disabled={cooldownSeconds > 0}
                onPress={requestOtpOnce}
                className="mt-2"
              >
                <Text className="text-[#259AAA] font-bold underline">
                  Kirim OTP
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={!isFormValid || loading}
              onPress={handleResetPassword}
              className={`w-full py-3.5 rounded-xl items-center mt-2 ${
                isFormValid ? "bg-[#259AAA]" : "bg-gray-300"
              }`}
            >
              <Text className="text-white text-base font-medium">
                {loading ? "Menyimpan..." : "Simpan Password"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
