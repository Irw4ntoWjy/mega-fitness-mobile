import { BackgroundGlow } from "@/components/Theme/background";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { ChevronDown, ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import { useMemo, useState } from "react";
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
import { signUp } from "../example/fetcher-example";
import { Gender } from "../models/auth";

function InputBox({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3">
      {children}
    </View>
  );
}

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
  const router = useRouter();
  const [openGender, setOpenGender] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [birthDate, setBirthDate] = useState(""); // ISO string / simple text
  const [identityNo, setIdentityNo] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDate, setOpenDate] = useState(false);

  const initialBirthDate = useMemo(
    () => resolveDate(birthDate, new Date(birthDate)),
    [birthDate]
  );

  const handleBirthDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setOpenDate(false);
    }
    if (event.type === "dismissed") {
      return;
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1" behavior={"padding"}>
      <SafeAreaView style={{ flex: 1 }}>
        <BackgroundGlow showText={true} />

        <TouchableOpacity className="mx-4" onPress={() => router.back()}>
          <Pressable className="w-10 h-10 items-center justify-center">
            <ChevronLeft size={22} />
          </Pressable>
        </TouchableOpacity>

        <ScrollView showsHorizontalScrollIndicator={false}>
          <View className="bg-white rounded-[30px] p-6 m-4">
            <Text className="text-black text-2xl font-bold mb-4">
              Create an Account
            </Text>
            {/* Username */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">Username</Text>
              <InputBox>
                <TextInput
                  placeholder="Enter username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  className="text-gray-900"
                />
              </InputBox>
            </View>

            {/* Email */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">Email</Text>
              <InputBox>
                <TextInput
                  placeholder="Enter email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="text-gray-900"
                />
              </InputBox>
            </View>

            {/* Password */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">Password</Text>
              <InputBox>
                <View className="flex flex-row items-center">
                  <TextInput
                    placeholder="Enter password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 text-gray-900"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Pressable>
                </View>
              </InputBox>
            </View>

            {/* Gender */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">Gender</Text>

              <Pressable onPress={() => setOpenGender(!openGender)}>
                <InputBox>
                  <View className="flex-row items-center justify-between">
                    <Text className=" text-gray-900 py-1 px-1">
                      {gender || "Select gender"}
                    </Text>
                    <ChevronDown size={16} color="#9CA3AF" />
                  </View>
                </InputBox>
              </Pressable>

              {openGender && (
                <View className="mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {(Object.values(Gender) as Gender[]).map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => {
                        setGender(g);
                        setOpenGender(false);
                      }}
                      className="px-4 py-3 border-b last:border-b-0 border-gray-200"
                    >
                      <Text className=" text-gray-900">{g}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Birth Date */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">Birth Date</Text>
              <InputBox>
                <TextInput
                  placeholder="1998-04-12"
                  value={birthDate}
                  onChangeText={setBirthDate}
                  className="text-gray-900"
                />
              </InputBox>
            </View>

            {/* Identity Number */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">
                Identity Number
              </Text>
              <InputBox>
                <TextInput
                  placeholder="3201xxxxxxxxxxxx"
                  value={identityNo}
                  onChangeText={setIdentityNo}
                  keyboardType="numeric"
                  className="text-gray-900"
                />
              </InputBox>
            </View>

            {/* Contact Number */}
            <View className="mb-3 gap-2">
              <Text className="text-black text-lg font-medium">
                Contact Number
              </Text>
              <InputBox>
                <TextInput
                  placeholder="08xxxxxxxxxx"
                  value={contactNumber}
                  onChangeText={setContactNumber}
                  keyboardType="phone-pad"
                  className="text-gray-900"
                />
              </InputBox>
            </View>

            {error && <Text className="text-red-500 text-center">{error}</Text>}

            <TouchableOpacity
              className="bg-[#259AAA] w-full py-3.5 rounded-xl items-center mt-4"
              onPress={async () => {
                const res = await signUp();
                console.log(res);
              }}
            >
              <Text className="text-white text-base font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
