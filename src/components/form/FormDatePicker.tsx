import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import { Input } from "../ui/input";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  className?: string;
  disabledDays?: {
    from?: Date;
    to?: Date;
  };
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const FormDatePicker = React.forwardRef<
  CalendarProps,
  FormDatePickerProps<any>
>(({ control, name, label, disabledDays, className }) => {

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...props } }) => {
        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover>
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={value ? format(value, "yyyy-MM-dd") : ''}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      const parsedDate = new Date(newDate);
                      if (isNaN(parsedDate.getTime())) {
                        onChange(undefined);
                      } else {
                        onChange(newDate);
                      }
                    }}
                  />
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "absolute right-0 top-[50%] translate-y-[-50%] rounded-l-none font-normal",
                        !value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    onSelect={(selectedDate) => {
                      if (!selectedDate) return;
                      const formattedDate = format(selectedDate, "yyyy-MM-dd");
                      onChange(formattedDate);
                    }}
                    defaultMonth={value}
                    initialFocus
                    fromDate={disabledDays?.from}
                    toDate={disabledDays?.to}
                    {...props}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
});
FormDatePicker.displayName = "FormDatePicker";

export { FormDatePicker };
