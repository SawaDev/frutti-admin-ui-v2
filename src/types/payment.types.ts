export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'paypal' | 'bank_transfer'
  details: CreditCardDetails | PayPalDetails | BankTransferDetails
}

interface CreditCardDetails {
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
}

interface PayPalDetails {
  email: string
}

interface BankTransferDetails {
  accountNumber: string
  routingNumber: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
} 