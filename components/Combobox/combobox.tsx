import { ChevronDown, Search, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type ComboboxProps = {
  value: string;
  placeholder?: string;
  options: string[];
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onSelect: (value: string) => void;
  containerClassName?: string;
  triggerClassName?: string;
  textClassName?: string;
  placeholderTextClassName?: string;
  showIcon?: boolean;
  showClear?: boolean;
  onClear?: () => void;
  iconColor?: string;
  iconSize?: number;
  dropdownClassName?: string;
  searchPlaceholder?: string;
};

export default function Combobox({
  value,
  placeholder = "Select",
  options,
  open,
  onOpenChange,
  onSelect,
  containerClassName,
  triggerClassName,
  textClassName,
  placeholderTextClassName,
  showIcon = true,
  showClear = true,
  onClear,
  iconColor = "#6B7280",
  iconSize = 16,
  dropdownClassName,
  searchPlaceholder = "Cari opsi...",
}: ComboboxProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open && query) {
      setQuery("");
    }
  }, [open, query]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }
    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  return (
    <View className={`flex-1 relative ${containerClassName || ""}`.trim()}>
      <View
        className={`flex-row items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm shadow-neutral-300 ${
          triggerClassName || ""
        }`.trim()}
      >
        <Pressable
          className="flex-1 flex-row items-center"
          onPress={() => onOpenChange(!open)}
        >
          <Text
            className={`flex-1 text-md ${
              value
                ? textClassName || "text-gray-700"
                : placeholderTextClassName || "text-gray-400"
            }`.trim()}
          >
            {value || placeholder}
          </Text>
          {showIcon ? <ChevronDown size={iconSize} color={iconColor} /> : null}
        </Pressable>
        {showClear && value ? (
          <Pressable
            onPress={() => {
              if (onClear) {
                onClear();
              } else {
                onSelect("");
              }
            }}
          >
            <X size={iconSize} color={iconColor} />
          </Pressable>
        ) : null}
      </View>

      {open ? (
        <View
          className={`absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg shadow-neutral-300 overflow-hidden z-20 ${
            dropdownClassName || ""
          }`.trim()}
        >
          <View className="flex-row items-center gap-2 px-3 border-b border-gray-200">
            <Search size={14} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-sm text-gray-700"
              placeholder={searchPlaceholder}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <ScrollView
            className="max-h-56"
            contentContainerStyle={{ paddingVertical: 4 }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Pressable
                  key={`combo-option-${option}`}
                  className="px-3 py-2"
                  onPress={() => {
                    onSelect(option);
                    onOpenChange(false);
                  }}
                >
                  <Text className="text-md text-gray-700">{option}</Text>
                </Pressable>
              ))
            ) : (
              <View className="px-3 py-2">
                <Text className="text-sm text-gray-400">Tidak ada hasil</Text>
              </View>
            )}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
