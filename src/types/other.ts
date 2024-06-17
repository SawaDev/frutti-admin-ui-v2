export interface Localized {
  uz: string
  ru: string
  en: string
}

export interface Option {
  value: string
  label: string
}

export type SheetType = {
  open: boolean
  setOpen: (value: boolean) => void
}