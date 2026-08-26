import { getPackageList } from "@/app/api/package";
import { BackgroundGlow } from "@/components/Theme/background";
import { router, useRouter } from "expo-router";
import {
  ChevronLeft,
  LucideSlidersHorizontal,
  Search,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
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
  id: string;
  packageType: string;
  packageName: string;
  image: string | null;
  description: string;
  packageTag: string | null;
  createdAt: string | null;
};

const NEW_WINDOW_DAYS = 7;

function parseBackendDate(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const [datePart, timePart] = trimmed.split(" ");
  const [year, month, day] = datePart.split("-").map((n) => Number(n));

  if (!year || !month || !day) return null;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  if (timePart) {
    const [h, m, s] = timePart.split(":").map((n) => Number(n));
    hours = h ?? 0;
    minutes = m ?? 0;
    seconds = s ?? 0;
  }

  const dt = new Date(year, month - 1, day, hours, minutes, seconds);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function isNewPackage(createdAt?: string | null) {
  const created = parseBackendDate(createdAt);
  if (!created) return false;

  const today = new Date();
  const diffMs = today.getTime() - created.getTime();
  if (diffMs < 0) return false;

  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_WINDOW_DAYS;
}

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
        from: "list-package",
      },
    });
    setTimeout(() => setIsNavigating(false), 1000);
  };

  return (
    <Pressable className="w-[48%] mb-4" onPress={handlePress}>
      <View className="bg-white rounded-2xl shadow-md relative">
        <View className="w-full h-44 rounded-t-2xl overflow-hidden bg-black">
          {item.image && item.image !== "null" && item.image !== "" ? (
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_ASSET_BASE_URL}${String(item.image)}`,
                cache: "reload",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-black" />
          )}
        </View>

        {isNewPackage(item.createdAt) ? (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#22C55E",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              zIndex: 1000,
              elevation: 30,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 10,
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              New
            </Text>
          </View>
        ) : null}

        {typeof item.packageTag === "string" &&
        (item.packageTag.toLowerCase().includes("bundle") ||
          item.packageTag.toLowerCase().includes("special") ||
          item.packageTag.includes("%")) ? (
          <View
            style={{
              position: "absolute",
              top: -10,
              left: -5,
              backgroundColor: "#06B6D4",
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
              {item.packageTag}
            </Text>
          </View>
        ) : null}

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

export default function ListPackages({ navigation, route }: Props) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredData, setFilteredData] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  const packageTypes = [
    "All",
    ...Array.from(new Set(packages.map((p) => p.packageType))),
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visiblePackages = packages.filter((item) => {
    const matchesType =
      filteredData === "All" ? true : item.packageType === filteredData;
    if (!matchesType) return false;

    if (!normalizedQuery) return true;
    return item.packageName.toLowerCase().includes(normalizedQuery);
  });

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);

      const map = new Map<string, Package>();

      const tryAll = await getPackageList({
        page: 1,
        limit: -1,
        show_mobile: true,
        is_full: false,
      });
      if (tryAll.success && tryAll.data && tryAll.data.total_page === 1) {
        tryAll.data.data.forEach((item: any) => {
          const id = String(item.package_id);
          map.set(id, {
            id,
            packageName: item.package_name,
            packageType: item.product_type_name ?? "Unknown",
            image: item.package_cover_image ?? null,
            description: item.package_description ?? "",
            packageTag: item.package_tag ?? null,
            createdAt: item.created_at ?? null,
          });
        });

        setPackages(Array.from(map.values()));
        return;
      }

      const first = await getPackageList({
        page: 1,
        limit: 50,
        show_mobile: true,
        is_full: false,
      });
      if (!first.success || !first.data) {
        setPackages([]);
        return;
      }

      const totalPages = first.data.total_page || 1;
      const applyPage = (items: any[]) => {
        items.forEach((item: any) => {
          const id = String(item.package_id);
          map.set(id, {
            id,
            packageName: item.package_name,
            packageType: item.product_type_name ?? "Unknown",
            image: item.package_cover_image ?? null,
            description: item.package_description ?? "",
            packageTag: item.package_tag ?? null,
            createdAt: item.created_at ?? null,
          });
        });
      };

      applyPage(first.data.data ?? []);

      for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
        const res = await getPackageList({
          page: pageNumber,
          limit: 50,
          show_mobile: true,
          is_full: false,
        });
        if (!res.success || !res.data) break;
        applyPage(res.data.data ?? []);
      }

      setPackages(Array.from(map.values()));
    } catch (error) {
      console.log("Error fetching packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow />
      <View className="mt-20 h-14 px-4 justify-center">
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/",
              params: { refresh: Date.now().toString() },
            })
          }
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
            value={searchQuery}
            onChangeText={setSearchQuery}
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
          data={visiblePackages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PackageCard item={item} />}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{
            paddingHorizontal: 20,

            paddingTop: 10,
            paddingBottom: 300,
          }}
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
