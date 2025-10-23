/**
 * Mock payment processing service for the Fiora Customer Dashboard
 */

export interface PaymentRequest {
  amount: number;
  paymentMethod: string;
  cardData?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  processingTime: number;
}

export interface PaymentMethodInfo {
  id: string;
  name: string;
  description: string;
  processingTime: number; // in milliseconds
  failureRate: number; // 0-1, probability of failure
}

export const PAYMENT_METHODS: Record<string, PaymentMethodInfo> = {
  card: {
    id: "card",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, American Express",
    processingTime: 2500,
    failureRate: 0.05, // 5% failure rate
  },
  apple_pay: {
    id: "apple_pay",
    name: "Apple Pay",
    description: "Pay with Touch ID or Face ID",
    processingTime: 1500,
    failureRate: 0.02, // 2% failure rate
  },
  google_pay: {
    id: "google_pay",
    name: "Google Pay",
    description: "Pay with your Google account",
    processingTime: 1500,
    failureRate: 0.02, // 2% failure rate
  },
  cash: {
    id: "cash",
    name: "Cash on Delivery",
    description: "Pay when your order arrives",
    processingTime: 500,
    failureRate: 0, // No failure for cash on delivery
  },
};

/**
 * Generate a mock transaction ID
 */
function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `txn_${timestamp}_${random}`.toUpperCase();
}

/**
 * Validate card data (basic validation for demo purposes)
 */
function validateCardData(cardData: PaymentRequest["cardData"]): string | null {
  if (!cardData) return null;

  const { cardNumber, expiryDate, cvv, cardholderName } = cardData;

  // Remove spaces from card number
  const cleanCardNumber = cardNumber.replace(/\s/g, "");

  // Basic card number validation (Luhn algorithm simulation)
  if (!/^\d{16}$/.test(cleanCardNumber)) {
    return "Invalid card number";
  }

  // Check for test card numbers that should fail
  const failingCardNumbers = ["4000000000000002", "4000000000000010"];
  if (failingCardNumbers.includes(cleanCardNumber)) {
    return "Your card was declined. Please try a different payment method.";
  }

  // Expiry date validation
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    return "Invalid expiry date format";
  }

  const [month, year] = expiryDate.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (
    parseInt(year) < currentYear ||
    (parseInt(year) === currentYear && parseInt(month) < currentMonth)
  ) {
    return "Card has expired";
  }

  // CVV validation
  if (!/^\d{3,4}$/.test(cvv)) {
    return "Invalid CVV";
  }

  // Cardholder name validation
  if (!cardholderName.trim() || cardholderName.trim().length < 2) {
    return "Invalid cardholder name";
  }

  return null;
}

/**
 * Simulate different payment failure scenarios
 */
function simulatePaymentFailure(
  paymentMethod: string,
  amount: number
): string | null {
  const methodInfo = PAYMENT_METHODS[paymentMethod];
  if (!methodInfo) {
    return "Unsupported payment method";
  }

  // Random failure based on method's failure rate
  if (Math.random() < methodInfo.failureRate) {
    const failures = [
      "Payment was declined by your bank. Please try again or use a different payment method.",
      "Insufficient funds. Please check your account balance and try again.",
      "Your payment method is temporarily unavailable. Please try again later.",
      "Transaction timeout. Please try again.",
      "Payment processing error. Please contact your bank if this continues.",
    ];
    return failures[Math.floor(Math.random() * failures.length)];
  }

  // Simulate amount-based failures
  if (amount > 10000) {
    // Large amounts might require additional verification
    if (Math.random() < 0.1) {
      return "Large transaction requires additional verification. Please contact your bank.";
    }
  }

  // Simulate network/service failures
  if (Math.random() < 0.01) {
    return "Payment service temporarily unavailable. Please try again in a few minutes.";
  }

  return null;
}

/**
 * Process a payment request
 */
export async function processPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  const startTime = Date.now();
  const methodInfo = PAYMENT_METHODS[request.paymentMethod];

  if (!methodInfo) {
    return {
      success: false,
      error: "Unsupported payment method",
      processingTime: 0,
    };
  }

  // Validate card data if payment method is card
  if (request.paymentMethod === "card") {
    const cardValidationError = validateCardData(request.cardData);
    if (cardValidationError) {
      return {
        success: false,
        error: cardValidationError,
        processingTime: Date.now() - startTime,
      };
    }
  }

  // Simulate processing time
  const processingTime = methodInfo.processingTime + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, processingTime));

  // Check for simulated failures
  const failureReason = simulatePaymentFailure(
    request.paymentMethod,
    request.amount
  );

  if (failureReason) {
    return {
      success: false,
      error: failureReason,
      processingTime: Date.now() - startTime,
    };
  }

  // Success case
  return {
    success: true,
    transactionId: generateTransactionId(),
    processingTime: Date.now() - startTime,
  };
}

/**
 * Get payment method information
 */
export function getPaymentMethodInfo(
  methodId: string
): PaymentMethodInfo | null {
  return PAYMENT_METHODS[methodId] || null;
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(amount: number): string | null {
  if (amount <= 0) {
    return "Payment amount must be greater than zero";
  }

  if (amount < 50) {
    return "Minimum order amount is ₴50";
  }

  if (amount > 50000) {
    return "Maximum order amount is ₴50,000. Please contact support for larger orders.";
  }

  return null;
}

/**
 * Format payment method display name
 */
export function formatPaymentMethodName(methodId: string): string {
  const methodInfo = PAYMENT_METHODS[methodId];
  return methodInfo ? methodInfo.name : methodId;
}

/**
 * Check if payment method requires card details
 */
export function requiresCardDetails(methodId: string): boolean {
  return methodId === "card";
}

/**
 * Get estimated processing time for a payment method
 */
export function getEstimatedProcessingTime(methodId: string): number {
  const methodInfo = PAYMENT_METHODS[methodId];
  return methodInfo ? methodInfo.processingTime : 2000;
}

/**
 * Mock webhook simulation for payment status updates
 */
export interface PaymentWebhookEvent {
  transactionId: string;
  status: "pending" | "completed" | "failed" | "refunded";
  timestamp: Date;
  amount: number;
  paymentMethod: string;
}

/**
 * Simulate payment webhook events (for future order tracking)
 */
export function simulatePaymentWebhook(
  transactionId: string,
  amount: number,
  paymentMethod: string
): PaymentWebhookEvent[] {
  const events: PaymentWebhookEvent[] = [];
  const baseTime = new Date();

  // Initial pending event
  events.push({
    transactionId,
    status: "pending",
    timestamp: new Date(baseTime.getTime()),
    amount,
    paymentMethod,
  });

  // Completion event (delayed)
  events.push({
    transactionId,
    status: "completed",
    timestamp: new Date(baseTime.getTime() + 30000), // 30 seconds later
    amount,
    paymentMethod,
  });

  return events;
}

/**
 * Payment analytics and reporting (mock data)
 */
export interface PaymentAnalytics {
  totalTransactions: number;
  successRate: number;
  averageProcessingTime: number;
  popularPaymentMethods: { method: string; percentage: number }[];
  dailyVolume: { date: string; amount: number; count: number }[];
}

/**
 * Get mock payment analytics
 */
export function getPaymentAnalytics(): PaymentAnalytics {
  return {
    totalTransactions: 1247,
    successRate: 0.94,
    averageProcessingTime: 2100,
    popularPaymentMethods: [
      { method: "card", percentage: 65 },
      { method: "apple_pay", percentage: 20 },
      { method: "google_pay", percentage: 10 },
      { method: "cash", percentage: 5 },
    ],
    dailyVolume: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      amount: Math.floor(Math.random() * 50000) + 10000,
      count: Math.floor(Math.random() * 50) + 10,
    })).reverse(),
  };
}
