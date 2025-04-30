"use client";

import type React from "react";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X, Trash2 } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options?: Option[]; // <-- allow undefined
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options = [], // <-- default to empty array
  selectedValues,
  setSelectedValues,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const removeSelected = (value: string) => {
    setSelectedValues(selectedValues.filter((item) => item !== value));
  };

  const clearAll = () => {
    setSelectedValues([]);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="flex justify-between px-2 pb-2 items-center min-w-[200px] h-full"
            variant="outline"
          >
            <div className="flex gap-1 flex-wrap">
              {selectedValues?.length > 0 ? (
                selectedValues?.map((val) => (
                  <Badge
                    key={val}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded-md text-base sm:text-sm"
                  >
                    {options.find((opt) => opt.value === val)?.label ?? val}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelected(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          removeSelected(val);
                        }
                      }}
                      // role="button"
                      // tabIndex={0}
                      className="ml-1 text-red-500 hover:text-red-700 cursor-pointer border-0 bg-transparent p-0"
                    >
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground font-normal">
                  {placeholder || "Select options..."}
                </span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
              className="text-lg sm:text-base"
            />
            {selectedValues?.length > 0 && (
              <div className="border-b flex justify-end">
                <Button
                  variant="ghost"
                  onClick={clearAll}
                  className="flex justify-between items-center gap-1 text-red-600 w-full px-8"
                >
                  <span>Clear All</span> <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            <CommandList className="sm:max-h-[300px] max-h-[200px] overflow-y-auto text-lg sm:text-base">
              {filteredOptions.length === 0 ? (
                <CommandEmpty>No options found.</CommandEmpty>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleSelection(option.value)}
                      className="text-lg sm:text-base"
                    >
                      <div className="flex items-center">
                        <Check
                          className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                        />
                        {option.label}
                      </div>
                    </CommandItem>
                  );
                })
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
