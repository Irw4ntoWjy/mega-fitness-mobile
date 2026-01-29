import { requestOtp, verifyAccount } from "@/app/api/auth";
import { BackgroundGlow } from "@/components/Theme/background";
import { useToast } from "@/components/Toast/toast-provider";
import { otpRequestSchema, verifyAccountSchema } from "@/type/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
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

export default function OtpVerification() {
  const router = useRouter();
  const { showToast } = useToast();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  useEffect(() => {
    const payload = { email: email ?? "" };
    const parsed = otpRequestSchema.safeParse(payload);
    if (!parsed.success) {
      showToast({
        message: parsed.error.issues[0]?.message || "Invalid email",
        variant: "error",
        duration: 2500,
      });
      return;
    }

    const loadOtp = async () => {
      const res = await requestOtp(parsed.data);
      if (!res.success || !res.data) {
        showToast({
          message: res.message || "Failed to request OTP",
          variant: "error",
          duration: 2500,
        });
        return;
      }
    };

    loadOtp();
  }, [email, showToast]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input automatically
    if (text && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // If deleting, move back
    if (!text && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    return { email: email ?? "", otp: code };
  };

  return (
    <KeyboardAvoidingView className="flex-1" behavior={"padding"}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Background glow same as login */}
        <BackgroundGlow showText={true} />
        {/* Back Button */}
        <TouchableOpacity className="mx-4" onPress={() => router.back()}>
          <Pressable
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <ChevronLeft size={22} />
          </Pressable>
        </TouchableOpacity>

        {/* TOP Logo */}
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("@/assets/png/mega-fitness-logo.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </View>

        {/* BOTTOM Card */}
        <View className="bg-[#FFF] rounded-[30px] p-6 m-4">
          <Text className="text-black text-2xl font-extrabold text-center">
            OTP Verification
          </Text>
          <Text className="text-[#555] text-base mt-2 text-center">
            Please check your OTP
          </Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-between mt-10 mb-12">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                className="bg-[#EFEEEF] text-black rounded-xl size-14 text-[22px] flex"
                style={{
                  textAlign: "center",
                  textAlignVertical: "center",
                  alignItems: "center",
                  alignContent: "center",
                  lineHeight: undefined,
                }}
                value={digit}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(text) => handleChange(text, index)}
                textContentType="oneTimeCode"
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            className="bg-[#259AAA] w-full py-4 rounded-xl items-center"
            disabled={isSubmitting}
            onPress={async () => {
              if (!email) {
                const payload = handleVerify();
                const parsed = verifyAccountSchema.safeParse(payload);
                if (!parsed.success) {
                  showToast({
                    message: parsed.error.issues[0]?.message || "Invalid OTP",
                    variant: "error",
                    duration: 2500,
                  });
                  return;
                }

                setIsSubmitting(true);
                const res = await verifyAccount(parsed.data);
                setIsSubmitting(false);
                if (!res.success) {
                  showToast({
                    message: res.message || "Verification failed",
                    variant: "error",
                    duration: 2500,
                  });
                  return;
                }

                router.replace("/(auth)/sign-in");
              }
            }}
          >
            <Text className="text-white text-lg font-semibold">Verify OTP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
