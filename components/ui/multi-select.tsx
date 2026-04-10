"use client";

import * as React from "react";
import { X, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-[44px] w-full flex-wrap items-center gap-1.5 rounded-[10px] border border-gray-200 bg-gray-50 px-3 py-2 text-sm shadow-none focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/15 focus-within:ring-offset-0 cursor-text",
            className
          )}
          onClick={() => setOpen(true)}
        >
          {selected.length > 0 ? (
            selected.map((item) => {
              const option = options.find((o) => o.value === item);
              if (!option) return null;
              return (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 pr-1 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {option.label}
                  <div
                    className="ml-1 rounded-full p-0.5 outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-indigo-200"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option.value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(option.value);
                    }}
                  >
                    <X className="h-3 w-3 text-indigo-700" />
                  </div>
                </Badge>
              );
            })
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      onChange(selected.filter((item) => item !== option.value));
                    } else {
                      onChange([...selected, option.value]);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
