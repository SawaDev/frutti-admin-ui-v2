import { type ClassValue, clsx } from "clsx"
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const dataTransfer = new DataTransfer();

  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}

export function formatNumberComma(number: number | null, minFraction?: number, maxFraction?: number): string {
  if (!number) return "0";
  return number.toLocaleString("en-US", {
    minimumFractionDigits: minFraction ?? 0,
    maximumFractionDigits: maxFraction ?? 4
  })
}

export const convertToQueryString = (params: Record<string, string | number | boolean | null | undefined>): string => {
  const queryString = Object.entries(params)
    .flatMap(([key, value]) => {
      if (value === null || value === undefined) {
        return [];
      }

      return [`${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`];
    })
    .join('&');

  return queryString ? `?${queryString}` : '';
}
