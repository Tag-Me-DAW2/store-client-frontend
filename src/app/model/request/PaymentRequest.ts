export interface CreditCardPaymentRequest {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  cvv: string;
  amount: number;
  currency: string;
  orderId: number;
}

export interface TransferPaymentRequest {
  sourceAccountNumber: string;
  amount: number;
  currency: string;
  orderId: number;
}
