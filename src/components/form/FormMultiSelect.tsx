import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import MultiSelect from "../ui/multi-select";
import { Option } from "@/types/other";

interface FormMultiSelectProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  options: Option[]
  defaultValues: string[]
  handleChange: (value: string[]) => void;
}

const FormMultiSelect = React.forwardRef<HTMLInputElement, FormMultiSelectProps<any>>(
  ({ className, control, name, label, options, handleChange, defaultValues }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem className={className}>
            {label && (
              <FormLabel>{label}</FormLabel>
            )}
            <FormControl>
              <MultiSelect
                options={options}
                onChange={handleChange}
                defaultValue={defaultValues}
                ref={ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
FormMultiSelect.displayName = "FormMultiSelect";

export { FormMultiSelect };
