import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
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
  }
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const FormDatePicker = React.forwardRef<CalendarProps, FormDatePickerProps<any>>(
  ({ control, name, label, disabledDays, className }) => {
    const [stringDate, setStringDate] = React.useState<string>("")

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
                      value={stringDate}
                      onChange={(e) => {
                        setStringDate(e.target.value)
                        const parsedDate = new Date(e.target.value)
                        if (isNaN(parsedDate.getTime())) {
                          onChange(undefined)
                        } else {
                          onChange(parsedDate)
                        }
                      }}
                    />
                    <PopoverTrigger asChild>
                      <Button
                      variant={"outline"}
                        className={cn(
                          "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
                          !value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={value}
                      onSelect={(selectedDate) => {
                        if (!selectedDate) return
                        onChange(format(selectedDate, "yyyy-MM-dd"))
                        setStringDate(format(selectedDate, "yyyy-MM-dd"))
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
  }
);
FormDatePicker.displayName = "FormDatePicker";

export { FormDatePicker };
