import { ChevronDown, Search, X } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

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
  dropdownInline?: boolean;
  dropdownPortal?: boolean;
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
  dropdownInline = false,
  dropdownPortal = false,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [portalLayout, setPortalLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const triggerRef = React.useRef<View>(null);

  const measureTrigger = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setPortalLayout({ x, y, width, height });
    });
  }, []);

  const handleToggle = (nextOpen: boolean) => {
    if (nextOpen && dropdownPortal) {
      requestAnimationFrame(() => {
        measureTrigger();
        onOpenChange(true);
      });
      return;
    }
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (!open && query) {
      setQuery("");
    }
  }, [open, query]);

  useEffect(() => {
    if (!open) {
      setPortalLayout(null);
    }
  }, [open]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (open && dropdownPortal && !portalLayout) {
      measureTrigger();
    }
  }, [open, dropdownPortal, portalLayout, measureTrigger]);

  useEffect(() => {
    if (open && dropdownPortal) {
      measureTrigger();
    }
  }, [keyboardHeight, open, dropdownPortal, measureTrigger]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }
    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  return (
    <View className={`flex-1 relative ${containerClassName || ""}`.trim()}>
      <View
        ref={triggerRef}
        collapsable={false}
        className={`flex-row items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm shadow-neutral-300 ${
          triggerClassName || ""
        }`.trim()}
      >
        <Pressable
          className="flex-1 flex-row items-center"
          onPress={() => handleToggle(!open)}
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

      {open && dropdownPortal && portalLayout ? (
        <Modal
          transparent
          visible={open}
          animationType="fade"
          onRequestClose={() => onOpenChange(false)}
        >
          <Pressable style={{ flex: 1 }} onPress={() => onOpenChange(false)}>
            <Pressable
              style={{
                position: "absolute",
                left: portalLayout?.x ?? 16,
                top: (() => {
                  const windowHeight = Dimensions.get("window").height;
                  const availableHeight = windowHeight - keyboardHeight;
                  const triggerY = portalLayout?.y ?? 0;
                  const triggerH = portalLayout?.height ?? 0;
                  const desiredTop = triggerY + triggerH + 8;
                  const spaceBelow = availableHeight - desiredTop;
                  const spaceAbove = triggerY - 8;
                  if (spaceBelow < 200 && spaceAbove > spaceBelow) {
                    const maxHeight = Math.max(120, spaceAbove);
                    return Math.max(8, triggerY - 8 - maxHeight);
                  }
                  return desiredTop;
                })(),
                width: portalLayout?.width ?? undefined,
                maxHeight: (() => {
                  const windowHeight = Dimensions.get("window").height;
                  const availableHeight = windowHeight - keyboardHeight;
                  const triggerY = portalLayout?.y ?? 0;
                  const triggerH = portalLayout?.height ?? 0;
                  const desiredTop = triggerY + triggerH + 8;
                  const spaceBelow = availableHeight - desiredTop;
                  const spaceAbove = triggerY - 8;
                  if (spaceBelow < 200 && spaceAbove > spaceBelow) {
                    return Math.max(120, spaceAbove);
                  }
                  return Math.max(120, spaceBelow);
                })(),
              }}
              onPress={() => {}}
            >
              <View
                className={`bg-white rounded-2xl shadow-sm shadow-neutral-300 overflow-hidden z-20 ${
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
                        className="mx-2 my-1  bg-white px-3 py-2"
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
                      <Text className="text-sm text-gray-400">
                        Tidak ada hasil
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      ) : open ? (
        <View
          className={`${
            dropdownInline
              ? "relative mt-2"
              : "absolute left-0 right-0 top-full mt-2"
          } bg-white rounded-2xl shadow-sm shadow-neutral-300 overflow-hidden z-20 ${
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
                  className="mx-2 my-1 rounded-lg bg-white px-3 py-2"
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
