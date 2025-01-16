"use client";

import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { BusinessFormData } from "@/lib/types/business";

interface ContentStepProps {
  form: UseFormReturn<BusinessFormData>;
}

export function ContentStep({ form }: ContentStepProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const content = form.watch("content") || {};

  const addContent = () => {
    if (newKey && newValue) {
      const currentValues = content[newKey] || [];
      form.setValue("content", {
        ...content,
        [newKey]: [...currentValues, newValue],
      });
      setNewValue("");
    }
  };

  const removeContent = (key: string, index: number) => {
    const values = content[key];
    const newValues = values.filter((_, i) => i !== index);
    if (newValues.length === 0) {
      const newContent = { ...content };
      delete newContent[key];
      form.setValue("content", newContent);
    } else {
      form.setValue("content", {
        ...content,
        [key]: newValues,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>Key</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g., Offerings"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Value</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Coffee"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <Button type="button" onClick={addContent} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </FormItem>
      </div>

      <div className="space-y-4">
        {Object.entries(content).map(([key, values]) => (
          <div key={key} className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">{key}</h4>
            <div className="space-y-2">
              {values.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1">{value}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeContent(key, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keywords</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter keywords separated by commas"
                value={field.value?.join(", ") || ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((k) => k.trim()).filter(Boolean)
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}