import { Option } from "@/types/other";

export const permissionOptions: Option[] = [
  {
    value: "read",
    label: "Ko'rish",
  },
  {
    value: "edit",
    label: "O'zgartirish",
  },
];

export const transactionOptions: Option[] = [
  {
    value: "cash",
    label: "Nadq",
  },
  {
    value: "card",
    label: "Karta",
  },
];

export const unitOptions: Option[] = [
  {
    value: "kg",
    label: "Kg",
  },
  {
    value: "gr",
    label: "Gr",
  },
  {
    value: "count",
    label: "Dona",
  },
];

export const purchaseOptions: Option[] = [
  {
    value: "finished",
    label: "Yetib kelgan",
  },
  {
    value: "waiting",
    label: "Kutilmoqda",
  },
  {
    value: "on_way",
    label: "Yo'lda",
  },
];

export const purchaseCountryOptions: Option[] = [
  {
    value: "uzbekistan",
    label: "O'zbekiston",
  },
  {
    value: "china",
    label: "Xitoy",
  },
];

export const ingredientCategoryOptions = [
  {
    value: "Rulonlar",
    label: "Rulonlar",
  },
  {
    value: "Paketlar",
    label: "Paketlar",
  },
  {
    value: "LID",
    label: "LID",
  },
  {
    value: "Stakanlar",
    label: "Stakanlar",
  },
  {
    value: "PVC",
    label: "PVC",
  },
  {
    value: "Plastik Bankalar",
    label: "Plastik Bankalar",
  },
  {
    value: "Karobkalar",
    label: "Karobkalar",
  },
  {
    value: "Nakleykalar",
    label: "Nakleykalar",
  },
  {
    value: "Meva rulon 20gr/30gr",
    label: "Meva rulon 20gr/30gr",
  },
  {
    value: "Parashok",
    label: "Parashok",
  },
  {
    value: "Konservantlar",
    label: "Konservantlar",
  },
  {
    value: "Aramatizatorlar",
    label: "Aramatizatorlar",
  },
];

export const currencyOptions = [
  {
    value: "USD",
    label: "Dollar",
  },
  {
    value: "SUM",
    label: "So'm",
  },
];

export const walletTypeOptions = [
  {
    value: "dollar",
    label: "Dollar",
  },
  {
    value: "sum",
    label: "So'm",
  },
];

export const questionOptions = [
  {
    value: "true",
    label: "Ha",
  },
  {
    value: "false",
    label: "Yo'q",
  },
];

export const paymentMethodOptions = [
  {
    value: "cash",
    label: "Naqd pul",
  },
  {
    value: "card",
    label: "Karta",
  },
];

export const discountTypeOptions = [
  {
    value: "amount",
    label: "Pulda",
  },
  {
    value: "percentage",
    label: "Foiz",
  },
];

export const saleOptions: Option[] = [
  {
    value: "finished",
    label: "Tugatilgan",
  },
  {
    value: "waiting",
    label: "Kutilmoqda",
  }
];