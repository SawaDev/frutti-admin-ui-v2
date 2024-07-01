import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Control, FieldValues, Path } from 'react-hook-form';
import { Option } from "@/types/other";

export interface FormSelectProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T, any>;
  name: Path<T>;
  options: Option[] | undefined
  label?: string;
}

const FormSelect = React.forwardRef<HTMLInputElement, FormSelectProps<any>>(
  ({ className, control, name, options, label, ...props }, ref) => {
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
              <SelectContent ref={ref}>
                {options?.map(o => (
                  <SelectItem value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
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