"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import MultiSelect from "./custom-fields/multi-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { FieldConfig } from "./types";
import type { Path } from "react-hook-form";
type Props<T extends z.ZodTypeAny> = {
  schema: T;
  fields: FieldConfig<z.infer<T>>[]; // ✅ Pass inferred schema type
  defaultValues?: z.infer<T>;
  onSubmit: (values: z.infer<T>) => void;
  className?: string;
};

export default function DynamicForm<T extends z.ZodTypeAny>({
  schema,
  fields,
  defaultValues,
  onSubmit,
  className,
}: Props<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-6 ${className ?? ""}`}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as Path<z.infer<T>>}
            render={({ field: controller }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {(() => {
                    switch (field.type) {
                      case "text":
                        return (
                          <Input
                            placeholder={field.placeholder}
                            {...controller}
                          />
                        );
                      case "number":
                        return (
                          <Input
                            type="number"
                            placeholder={field.placeholder}
                            {...controller}
                          />
                        );
                      case "textarea":
                        return (
                          <Textarea
                            placeholder={field.placeholder}
                            {...controller}
                          />
                        );
                      case "checkbox":
                        return (
                          <Checkbox
                            checked={controller.value}
                            onCheckedChange={controller.onChange}
                          />
                        );
                      case "multi-select":
                        return (
                          <MultiSelect
                            value={controller.value}
                            onChange={controller.onChange}
                            options={(field.options ?? []).map((opt) => ({
                              id: opt.value,
                              name: opt.label,
                            }))}
                            placeholder={field.placeholder}
                          />
                        );
                      case "select":
                        return (
                          <select
                            value={controller.value}
                            onChange={controller.onChange}
                            className="border rounded px-2 py-1"
                          >
                            <option value="">Select...</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        );
                      case "date":
                        return <Input type="date" {...controller} />;
                      default:
                        return null;
                    }
                  })()}
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
