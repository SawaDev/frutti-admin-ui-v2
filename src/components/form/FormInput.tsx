import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { NumericFormat } from 'react-number-format';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

interface FormInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  onInputBlur?: (value: any) => void;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps<any>>(
  ({ className, type, control, name, label, onChange, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field: { value, onChange:fieldOnChange, onBlur, ...fieldProps } }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              {type === "number" ? (
                <NumericFormat
                  customInput={Input}
                  thousandSeparator=" "
                  decimalScale={8}
                  value={value || ''}
                  onValueChange={(values) => {
                    fieldOnChange(values.floatValue);
                    //@ts-ignore
                    onChange?.(values.floatValue);
                  }}
                  onBlur={onBlur}
                  {...fieldProps}
                  defaultValue={undefined}
                />
              ) : type === 'checkbox' ? (
                <Checkbox
                  checked={value}
                  onCheckedChange={(value) => fieldOnChange(value)}
                  {...fieldProps}
                />
              ) : (
                <Input
                  type={type}
                  value={value}
                  onChange={event => fieldOnChange(event.target.value)}
                  {...props}
                  {...fieldProps}
                  ref={ref}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };
