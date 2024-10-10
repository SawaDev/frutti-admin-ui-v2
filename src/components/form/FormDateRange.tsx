import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { DayPicker, DateRange, Matcher } from "react-day-picker";
import { Input } from "../ui/input";

interface FormDateRangeProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  disabledDays?: Matcher | Matcher[]
  numberOfMonths?: number
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const FormDateRange = React.forwardRef<CalendarProps, FormDateRangeProps<any>>(
  ({ control, name, label, disabledDays, numberOfMonths }) => {
    const [range, setRange] = React.useState<DateRange | undefined>(undefined)
    const [stringDate, setStringDate] = React.useState<string>("")

    return (
      <FormField
        control={control}
        name={name}
        render={({ field: { value, onChange, ...props } }) => {
          return (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Popover>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      value={stringDate}
                      readOnly
                    />
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
                          !range && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={range}
                      onSelect={(selectedRange) => {
                        setRange(selectedRange);
                        const formattedRange = selectedRange
                          ? `${selectedRange?.from ? format(selectedRange?.from, "dd/MM/yyyy") : ""} - ${selectedRange?.to ? format(selectedRange?.to, "dd/MM/yyyy") : ""}`
                          : "";
                        setStringDate(formattedRange);
                        onChange(selectedRange);
                      }}
                      disabled={disabledDays}
                      numberOfMonths={numberOfMonths}
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

FormDateRange.displayName = "FormDateRange";

export { FormDateRange };
