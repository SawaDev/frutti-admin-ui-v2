import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export interface FormInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps<any>>(
  ({ className, type, control, name, label, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field: { value, onChange, ...fieldProps } }) => {
          return (
            <FormItem className={className}>
              {label && (
                <FormLabel>{label}</FormLabel>
              )}
              <FormControl>
                {type === "number" ? (
                  <Input
                    type={type}
                    value={value}
                    onChange={event => onChange(+event.target.value)}
                    {...props}
                    {...fieldProps}
                    ref={ref}
                  />
                ) : (
                  <Input
                    type={type}
                    value={value}
                    onChange={event => onChange(event.target.value)}
                    {...props}
                    {...fieldProps}
                    ref={ref}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };
