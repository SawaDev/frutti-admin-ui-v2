import React from 'react'
import { endOfMonth, format, startOfMonth } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


interface DateRangeType {
  onChange?: (range: DateRange | undefined) => void;
}

const DatePickerWithRange: React.FC<DateRangeType> = ({ onChange }) => {
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: currentMonthStart,
    to: currentMonthEnd,
  })

  return (
    <div className={"grid gap-2"}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd-MM-yyyy")} -{" "}
                  {format(date.to, "dd-MM-yyyy")}
                </>
              ) : (
                format(date.from, "dd-MM-yyyy")
              )
            ) : (
              <span>Kunni tanlang</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range)
              if (onChange) {
                onChange(range)
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerWithRange