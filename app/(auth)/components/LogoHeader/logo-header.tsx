import { Image, View } from "react-native";

export default function LogoHeader() {
  return (
    <View className="items-center my-10">
      <Image
        source={require("@/assets/png/mega-fitness-logo.png")}
        className="w-32 h-32"
        resizeMode="contain"
      />
    </View>
  );
}
