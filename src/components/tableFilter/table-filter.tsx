import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Column, RowData } from "@tanstack/react-table"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React from "react"

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select' | 'date_range' | 'no_filter'
    options?: { label: string, value: string }[]
  }
}

const Filter = ({ column }: { column: Column<any, unknown> }) => {
  const [date, setDate] = React.useState<Date>()

  const { filterVariant } = column.columnDef.meta ?? {}

  const columnFilterValue = column.getFilterValue()
  const { options } = column.columnDef.meta ?? {}

  return filterVariant === 'range' ? (
    <RangeFilter
      columnFilterValue={columnFilterValue as [number, number]}
      column={column}
    />
  ) : filterVariant === 'select' ? (
    <select
      className="bg-white px-2 border rounded-md w-full"
      onChange={e => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">Hammasi</option>
      {options?.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  ) : filterVariant === 'date_range' ? (
    <DateRangeFilter
      date={date}
      setDate={setDate}
      column={column}
    />
  ) : filterVariant === 'text' ? (
    <DebouncedInput
      className="w-full border shadow rounded px-2"
      onChange={value => column.setFilterValue(value)}
      placeholder={`Qidirish...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  ) : (
    <></>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

const RangeFilter = ({
  columnFilterValue,
  column
}: {
  columnFilterValue: [number, number]
  column: Column<any, unknown>
}) => {
  return <div>
    <div className="w-full flex space-x-2">
      <DebouncedInput
        type="number"
        value={columnFilterValue?.[0] ?? ''}
        onChange={value =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-1/2 border shadow rounded px-2"
      />
      <DebouncedInput
        type="number"
        value={columnFilterValue?.[1] ?? ''}
        onChange={value =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max`}
        className="w-1/2 border shadow rounded px-2"
      />
    </div>
    <div className="h-1" />
  </div>
}

const DateRangeFilter = ({
  date,
  column,
  setDate
}: {
  date: Date | undefined
  column: Column<any, unknown>
  setDate: (date: Date | undefined) => void
}) => {
  return (
    <div className={"grid gap-2"}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal  px-2 m-0 h-6",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd-MM-yyyy") : <span>Kunni tanlang</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value) => {
              if (value) {
                column.setFilterValue(format(value, "dd-MM-yyyy"))
              } else {
                column.setFilterValue('')
              }
              setDate(value)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Filter