import { BackgroundGlow } from "@/components/Theme/background";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRouter } from "expo-router";
import {
  ChevronLeft,
  LucideSlidersHorizontal,
  Search,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Package = {
  id: number;
  packageType: string;
  packageName: string;
  image: string;
  description: string;
};



type Props = {
  navigation?: { goBack: () => void };
  route?: { params?: { id?: number; orderNo?: string } };
};

function PackageCard({ item }: { item: Package }) {

  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePress = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    router.push({
      pathname: "/packages/[id]/detail",
      params: {
        id: item.id,
        packageName: item.packageName,
        description: item.description ?? "",
        image: item.image ?? "",
      },
    });
    setTimeout(() => setIsNavigating(false), 1000); 
  };

  return (
    <Pressable
      className="w-[48%] mb-4"
      onPress={handlePress}
    >
      <View className="bg-white rounded-2xl shadow-md relative">
        <View className="w-full h-44 rounded-t-2xl overflow-hidden">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* <View
          style={{
            position: "absolute",
            top: -10,
            left: -5,
            backgroundColor: item.tagColor,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 8,
            zIndex: 1000,
            elevation: 30,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {item.status}
          </Text>
        </View> */}

        <View className="flex-row items-center justify-between px-4 py-4">
          <View>
            <Text className="text-black font-bold text-lg">
              {item.packageName}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function listPackages({ navigation, route }: Props) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredData, setFilteredData] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const packageTypes = [
    "All",
    ...Array.from(new Set(packages.map((p) => p.packageType))),
  ];

  useEffect(() => {
    fetchPackages(1);
  }, []);

  const fetchPackages = async (pageNumber = 1) => {
    try {
      if (!hasMore && pageNumber !== 1) return;

      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/package/list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            page: pageNumber,
            limit: 10,
          }),
        }
      );

      const json = await response.json();
      console.log("JSON:", json);

      if (json.success) {
        const formatted = json.data.data.map((item: any) => ({
          id: item.package_id,
          packageName: item.package_name,
          packageType: item.product_type_name,
          image: item.package_cover_image,
          description: item.package_description,
        }));

        if (pageNumber === 1) {
          setPackages(formatted);
        } else {
          setPackages((prev) => [...prev, ...formatted]);
        }

        setHasMore(pageNumber < json.data.total_page);
        setPage(pageNumber);
      }
    } catch (error) {
      console.log("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow />
      <View className="mt-20 h-14 px-4 justify-center">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>
      </View>

      <View className="w-full flex-row items-center gap-3 px-6">
        <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-3 shadow">
          <Search size={18} color="#6b7280" />
          <TextInput
            placeholder="Search ..."
            placeholderTextColor="#9ca3af"
            className="ml-2 flex-1 text-base text-gray-700"
          />
        </View>
        <Pressable
          className="bg-[#259AAA] rounded-full p-3 shadow items-center justify-center"
          onPress={() => setShowFilter(true)}
        >
          <LucideSlidersHorizontal size={18} color="white" />
        </Pressable>
      </View>

      {/* Content */}
      <View className="mt-4">
        <View className="px-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full"
            contentContainerStyle={{ gap: 10 }}
          >
            {packageTypes.map((item, index) => {
              const selected = filteredData === item;

              return (
                <Pressable
                  key={`${item}-${index}`}
                  onPress={() => setFilteredData(item)}
                  className={`px-5 py-2.5 rounded-full ${
                    selected
                      ? "bg-[#259AAA]"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selected ? "text-white" : "text-black"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        <View className="my-2"></View>
        <FlatList
          data={
            filteredData === "All"
              ? packages
              : packages.filter((item) => item.packageType === filteredData)
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PackageCard item={item} />}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{
            paddingHorizontal: 20,

            paddingTop: 10,
            paddingBottom: 300,
          }}
          onEndReached={() => {
            if (!loading && hasMore) {
              fetchPackages(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
      <Modal
        visible={showFilter}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilter(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Pressable onPress={() => setShowFilter(false)}>
              <View className="w-[85%] bg-white rounded-2xl p-5">
                <Text className="text-lg font-semibold mb-4 text-center">
                  Select Package Type
                </Text>

                {packageTypes.map((t) => (
                  <Pressable
                    key={t}
                    className={`py-3 rounded-xl mb-2 ${
                      filteredData === t
                        ? "bg-[#259AAA]"
                        : "bg-white border border-gray-200"
                    }`}
                    onPress={() => {
                      setFilteredData(t);
                      setShowFilter(false);
                    }}
                  >
                    <Text
                      className={`text-center ${
                        filteredData === t ? "text-white" : "text-black"
                      }`}
                    >
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
