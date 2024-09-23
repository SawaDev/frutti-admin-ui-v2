import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Control, FieldValues, Path } from 'react-hook-form';
import { Option } from "@/types/other";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

export interface FormSelectProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T, any>;
  name: Path<T>;
  options: Option[] | undefined
  label?: string | React.ReactNode;
  handleNew?: () => void;
}

const FormSelect = React.forwardRef<HTMLInputElement, FormSelectProps<any>>(
  ({ className, control, name, options, label, handleNew, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        {...props}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang..." />
                </SelectTrigger>
              </FormControl>
              {options && options.length > 0 ? (
                <SelectContent ref={ref}>
                  {options?.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              ) : (
                <SelectContent ref={ref}>
                  <div className="flex flex-col items-center gap-2 my-5">
                    <span>Hech narsa yo'q.</span>
                    {handleNew && (
                      <Button onClick={handleNew} variant={"outline"} className="w-fit flex gap-1 justify-center items-center">
                        <PlusCircle className="w-4 h-4" />
                        Yangi Kategoriya
                      </Button>
                    )}
                  </div>
                </SelectContent>
              )}
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
FormSelect.displayName = "FormSelect";

export { FormSelect };