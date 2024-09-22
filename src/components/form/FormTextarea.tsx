import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

interface FormTextareaProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps<any>>(
  ({ className, type, control, name, label, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field: { value, ...fieldProps } }) => {
          return (
            <FormItem className={className}>
              {label && (
                <FormLabel>{label}</FormLabel>
              )}
              <FormControl>
                <Textarea
                  value={value}
                  {...props}
                  {...fieldProps}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export { FormTextarea };
