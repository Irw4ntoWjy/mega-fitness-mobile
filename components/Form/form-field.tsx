import React from "react";
import { Text, View } from "react-native";
import { z } from "zod";

type FormFieldProps = {
  label: string;
  name: string;
  schema: z.ZodObject<any>;
  error?: string;
  children: React.ReactNode;
};

function isOptionalField(schema: z.ZodObject<any>, name: string) {
  const shape = schema.shape;
  const fieldSchema = shape?.[name] as z.ZodTypeAny | undefined;
  if (!fieldSchema) return false;
  const isOptional = fieldSchema.safeParse(undefined).success;
  const isNullable = fieldSchema.safeParse(null).success;
  return isOptional || isNullable;
}

export function FormField({
  label,
  name,
  schema,
  error,
  children,
}: FormFieldProps) {
  const required = !isOptionalField(schema, name);

  return (
    <View className="mb-3 gap-2">
      <Text className="text-black text-lg font-medium">
        {label}
        {required ? <Text className="text-red-500"> *</Text> : null}
      </Text>
      {children}
      {error ? <Text className="text-red-500 text-sm">{error}</Text> : null}
    </View>
  );
}
