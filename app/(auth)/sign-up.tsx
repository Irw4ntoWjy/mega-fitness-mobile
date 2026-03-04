import { signUp } from "@/app/api/auth";
import TermsModal from "@/components/auth/terms-and-condition-modal";
import { FormField } from "@/components/Form/form-field";
import { BackgroundGlow } from "@/components/Theme/background";
import { mapFieldErrors } from "@/lib/api-error";
import { signUpSchema } from "@/type/auth";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { ChevronDown, ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { Gender } from "../models/auth";

function resolveDate(value: unknown, fallback: Date) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return fallback;
}

export default function SignUp() {
  type SignUpPayload = z.infer<typeof signUpSchema>;
  const [payload, setPayload] = useState<SignUpPayload | undefined>(undefined);

  const router = useRouter();
  const [openGender, setOpenGender] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [birthDate, setBirthDate] = useState(new Date());
  const [identityNo, setIdentityNo] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<
      Record<
        | "name"
        | "email"
        | "password"
        | "birth_date"
        | "gender"
        | "identity_no"
        | "contact_number",
        string
      >
    >
  >({});
  const [openDate, setOpenDate] = useState(false);
  const emailCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedEmail = useRef<string>("");

  const [showTnc, setShowTnc] = useState(false);

  const initialBirthDate = useMemo(
    () => resolveDate(birthDate, new Date()),
    [birthDate],
  );

  const handleBirthDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setOpenDate(false);
    }
    if (event.type === "dismissed") {
      return;
    }
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const scheduleEmailCheck = () => {
    if (emailCheckTimer.current) {
      clearTimeout(emailCheckTimer.current);
    }
    emailCheckTimer.current = setTimeout(async () => {
      const value = email.trim();
      if (!value || value === lastCheckedEmail.current) {
        return;
      }
      lastCheckedEmail.current = value;

      const res = await signUp({ email: value } as any);
      const backendFieldErrors = mapFieldErrors(res, { EMAIL: "email" });
      setFieldErrors((prev) => ({
        ...prev,
        email: backendFieldErrors.email,
      }));
    }, 350);
  };
  return (
    <KeyboardAvoidingView className="flex-1" behavior={"padding"}>
      <SafeAreaView style={{ flex: 1 }}>
        <BackgroundGlow showText={true} />

        <TouchableOpacity className="mx-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <ChevronLeft size={22} />
          </Pressable>
        </TouchableOpacity>

        <ScrollView showsHorizontalScrollIndicator={false}>
          <View className="bg-white rounded-[30px] p-6 m-4">
            <Text className="text-black text-2xl font-bold mb-4">
              Buat Akun
            </Text>
            {/* Name */}
            <FormField
              label="Nama"
              name="name"
              schema={signUpSchema}
              error={fieldErrors.name}
            >
              <View
                className={`bg-gray-50 border rounded-lg px-3 py-3 ${
                  fieldErrors.name ? "border-red-400" : "border-gray-300"
                }`}
              >
                <TextInput
                  placeholder="Masukkan nama"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  className="text-gray-900"
                />
              </View>
            </FormField>

            {/* Email */}
            <FormField
              label="Email"
              name="email"
              schema={signUpSchema}
              error={fieldErrors.email}
            >
              <View
                className={`bg-gray-50 border rounded-lg px-3 py-3 ${
                  fieldErrors.email ? "border-red-400" : "border-gray-300"
                }`}
              >
                <TextInput
                  placeholder="Masukkan email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onBlur={scheduleEmailCheck}
                  className="text-gray-900"
                />
              </View>
            </FormField>

            {/* Password */}
            <FormField
              label="Password"
              name="password"
              schema={signUpSchema}
              error={fieldErrors.password}
            >
              <View
                className={`bg-gray-50 border rounded-lg px-3 py-3 ${
                  fieldErrors.password ? "border-red-400" : "border-gray-300"
                }`}
              >
                <View className="flex flex-row items-center">
                  <TextInput
                    placeholder="Masukkan password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 text-gray-900"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Pressable>
                </View>
              </View>
            </FormField>

            {/* Gender */}
            <FormField
              label="Gender"
              name="gender"
              schema={signUpSchema}
              error={fieldErrors.gender}
            >
              <Pressable onPress={() => setOpenGender(!openGender)}>
                <View
                  className={`bg-gray-50 border rounded-lg px-3 py-3 ${
                    fieldErrors.gender ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-900 py-1 px-1">
                      {gender || "Pilih gender"}
                    </Text>
                    <ChevronDown size={16} color="#9CA3AF" />
                  </View>
                </View>
              </Pressable>
              {openGender && (
                <View className=" bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {(Object.values(Gender) as Gender[]).map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => {
                        setGender(g);
                        setOpenGender(false);
                      }}
                      className="px-4 py-3 border-b last:border-b-0 border-gray-200"
                    >
                      <Text className="text-gray-900">{g}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </FormField>

            {/* Birth Date */}
            <FormField
              label="Tanggal Lahir"
              name="birth_date"
              schema={signUpSchema}
              error={fieldErrors.birth_date}
            >
              <Pressable onPress={() => setOpenDate(!openDate)}>
                <View
                  className={`bg-gray-50 border rounded-lg px-3 py-3 ${
                    fieldErrors.birth_date
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-900 py-1 px-1">
                      {initialBirthDate.toLocaleDateString("en-GB")}
                    </Text>
                    <ChevronDown size={16} color="#9CA3AF" />
                  </View>
                </View>
              </Pressable>
              {openDate && (
                <View>
                  <DateTimePicker
                    value={initialBirthDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleBirthDateChange}
                    textColor="#000"
                  />
                </View>
              )}
            </FormField>

            {/* Identity Number */}
            <FormField
              label="Nomor Induk Kependudukan"
              name="identity_no"
              schema={signUpSchema}
              error={fieldErrors.identity_no}
            >
              <View
                className={`bg-gray-50 border rounded-lg px-3 py-3 ${
                  fieldErrors.identity_no ? "border-red-400" : "border-gray-300"
                }`}
              >
                <TextInput
                  placeholder="3201xxxxxxxxxxxx"
                  value={identityNo}
                  onChangeText={setIdentityNo}
                  keyboardType="numeric"
                  className="text-gray-900"
                />
              </View>
            </FormField>

            {/* Contact Number */}
            <FormField
              label="Nomor Telepon"
              name="contact_number"
              schema={signUpSchema}
              error={fieldErrors.contact_number}
            >
              <View
                className={`bg-gray-50 border rounded-lg px-3 py-3 ${
                  fieldErrors.contact_number
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              >
                <TextInput
                  placeholder="08xxxxxxxxxx"
                  value={contactNumber}
                  onChangeText={setContactNumber}
                  keyboardType="phone-pad"
                  className="text-gray-900"
                />
              </View>
            </FormField>

            {error && <Text className="text-red-500 text-center">{error}</Text>}

            <TouchableOpacity
              className="bg-[#259AAA] w-full py-3.5 rounded-xl items-center mt-4"
              onPress={async () => {
                setError(null);
                setFieldErrors({});
                setPayload({
                  email: email.trim(),
                  password,
                  name: name.trim(),
                  birth_date: birthDate.toISOString(),
                  gender,
                  identity_no: identityNo.trim(),
                  contact_number: contactNumber.trim() || undefined,
                });

                const parsed = signUpSchema.safeParse(payload);
                if (!parsed.success) {
                  const flattened = parsed.error.flatten().fieldErrors;
                  setFieldErrors({
                    name: flattened.name?.[0],
                    email: flattened.email?.[0],
                    password: flattened.password?.[0],
                    birth_date: flattened.birth_date?.[0],
                    gender: flattened.gender?.[0],
                    identity_no: flattened.identity_no?.[0],
                    contact_number: flattened.contact_number?.[0],
                  });
                  return;
                }
                setShowTnc(true);
              }}
            >
              <Text className="text-white text-base font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
          <TermsModal
            visible={showTnc}
            onDecline={() => {
              setShowTnc(false);
            }}
            onAccept={async () => {
              setShowTnc(false);
              const parsed = signUpSchema.safeParse(payload);

              if (!parsed.success) {
                const flattened = parsed.error.flatten().fieldErrors;

                setFieldErrors({
                  name: flattened.name?.[0],
                  email: flattened.email?.[0],
                  password: flattened.password?.[0],
                  birth_date: flattened.birth_date?.[0],
                  gender: flattened.gender?.[0],
                  identity_no: flattened.identity_no?.[0],
                  contact_number: flattened.contact_number?.[0],
                });

                return;
              }

              const res = await signUp(parsed.data);
              if (!res.success) {
                const backendFieldErrors = mapFieldErrors(res, {
                  EMAIL: "email",
                  PASSWORD: "password",
                  NAME: "name",
                  BIRTH_DATE: "birth_date",
                  GENDER: "gender",
                  IDENTITY_NO: "identity_no",
                  CONTACT_NUMBER: "contact_number",
                });
                if (Object.keys(backendFieldErrors).length > 0) {
                  setFieldErrors(backendFieldErrors);
                  return;
                }
                setError(res.message || "Pendaftaran gagal.");
                return;
              }

              router.replace({
                pathname: "/(auth)/otp",
                params: { email: parsed.data.email },
              });
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
