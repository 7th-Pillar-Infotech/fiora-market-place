import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentForm } from "@/components/checkout/payment-form";

describe("PaymentForm", () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isProcessing: false,
    totalAmount: 1500,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPaymentForm = (props = {}) => {
    return render(<PaymentForm {...defaultProps} {...props} />);
  };

  describe("Payment method selection", () => {
    it("should render all payment method options", () => {
      renderPaymentForm();

      expect(screen.getByText("Credit/Debit Card")).toBeInTheDocument();
      expect(screen.getByText("Apple Pay")).toBeInTheDocument();
      expect(screen.getByText("Google Pay")).toBeInTheDocument();
      expect(screen.getByText("Cash on Delivery")).toBeInTheDocument();
    });

    it("should default to card payment method", () => {
      renderPaymentForm();

      const cardRadio = screen.getByRole("radio", {
        name: /credit\/debit card/i,
      });
      expect(cardRadio).toBeChecked();
    });

    it("should allow switching payment methods", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      const applePayOption = screen.getByLabelText(/apple pay/i);
      await user.click(applePayOption);

      const applePayRadio = screen.getByRole("radio", { name: /apple pay/i });
      expect(applePayRadio).toBeChecked();
    });
  });

  describe("Card payment form", () => {
    it("should show card details form when card is selected", () => {
      renderPaymentForm();

      expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    });

    it("should hide card details form for non-card payment methods", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      // Initially card details should be visible
      expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();

      // Select Apple Pay
      const applePayOption = screen.getByLabelText(/apple pay/i);
      await user.click(applePayOption);

      // Card details should be hidden
      expect(
        screen.queryByLabelText(/cardholder name/i)
      ).not.toBeInTheDocument();
    });

    it("should format card number with spaces", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      const cardNumberInput = screen.getByLabelText(/card number/i);
      await user.type(cardNumberInput, "1234567890123456");

      expect(cardNumberInput).toHaveValue("1234 5678 9012 3456");
    });

    it("should format expiry date as MM/YY", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      const expiryInput = screen.getByLabelText(/expiry date/i);
      await user.type(expiryInput, "1225");

      expect(expiryInput).toHaveValue("12/25");
    });

    it("should limit CVV to 4 digits", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      const cvvInput = screen.getByLabelText(/cvv/i);
      await user.type(cvvInput, "12345");

      expect(cvvInput).toHaveValue("1234");
    });
  });

  describe("Card payment validation", () => {
    it("should prevent submission with empty card fields", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      const submitButton = screen.getByRole("button", {
        name: /complete order/i,
      });
      await user.click(submitButton);

      // Form should not submit with empty card fields
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should prevent submission with invalid card number", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      // Fill some fields but leave card number invalid
      await user.type(screen.getByLabelText(/cardholder name/i), "John Doe");
      await user.type(screen.getByLabelText(/card number/i), "1234");
      await user.type(screen.getByLabelText(/expiry date/i), "1225");
      await user.type(screen.getByLabelText(/cvv/i), "123");

      const submitButton = screen.getByRole("button", {
        name: /complete order/i,
      });
      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should prevent submission with invalid expiry date", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      await user.type(screen.getByLabelText(/cardholder name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/card number/i),
        "1234567890123456"
      );
      await user.type(screen.getByLabelText(/expiry date/i), "1325"); // Invalid month
      await user.type(screen.getByLabelText(/cvv/i), "123");

      const submitButton = screen.getByRole("button", {
        name: /complete order/i,
      });
      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should prevent submission with invalid CVV", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      await user.type(screen.getByLabelText(/cardholder name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/card number/i),
        "1234567890123456"
      );
      await user.type(screen.getByLabelText(/expiry date/i), "1225");
      await user.type(screen.getByLabelText(/cvv/i), "12"); // Too short

      const submitButton = screen.getByRole("button", {
        name: /complete order/i,
      });
      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Successful payment submission", () => {
    it("should submit valid card payment data", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      // Fill all card fields with valid data
      await user.type(screen.getByLabelText(/cardholder name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/card number/i),
        "1234567890123456"
      );
      await user.type(screen.getByLabelText(/expiry date/i), "1225");
      await user.type(screen.getByLabelText(/cvv/i), "123");

      const submitButton = screen.getByRole("button", {
        name: /complete order/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          paymentMethod: "card",
          cardData: {
            cardNumber: "1234 5678 9012 3456",
            expiryDate: "12/25",
            cvv: "123",
            cardholderName: "John Doe",
          },
        });
      });
    });

    it("should submit Apple Pay without card data", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      // Select Apple Pay
      const applePayOption = screen.getByLabelText(/apple pay/i);
      await user.click(applePayOption);

      const submitButton = screen.getByRole("button", {
        name: /complete order/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          paymentMethod: "apple_pay",
          cardData: undefined,
        });
      });
    });

    it("should submit Google Pay without card data", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      // Select Google Pay
      const googlePayOption = screen.getByLabelText(/google pay/i);
      await user.click(googlePayOption);

      const submitButton = screen.getByRole("button", {
        name: /complete order/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          paymentMethod: "google_pay",
          cardData: undefined,
        });
      });
    });

    it("should submit Cash on Delivery without card data", async () => {
      const user = userEvent.setup();
      renderPaymentForm();

      // Select Cash on Delivery
      const cashOption = screen.getByLabelText(/cash on delivery/i);
      await user.click(cashOption);

      const submitButton = screen.getByRole("button", {
        name: /complete order/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          paymentMethod: "cash",
          cardData: undefined,
        });
      });
    });
  });

  describe("Processing state", () => {
    it("should show processing state when isProcessing is true", () => {
      renderPaymentForm({ isProcessing: true });

      const submitButton = screen.getByRole("button", { name: /processing/i });
      expect(submitButton).toBeDisabled();
      expect(screen.getByText("Processing...")).toBeInTheDocument();
    });

    it("should disable submit button when processing", () => {
      renderPaymentForm({ isProcessing: true });

      const submitButton = screen.getByRole("button");
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Error handling", () => {
    it("should display payment errors", () => {
      const errors = {
        payment: "Payment processing failed. Please try again.",
      };

      renderPaymentForm({ errors });

      expect(
        screen.getByText("Payment processing failed. Please try again.")
      ).toBeInTheDocument();
    });
  });

  describe("Total amount display", () => {
    it("should display the correct total amount on submit button", () => {
      renderPaymentForm({ totalAmount: 2500 });

      // The formatCurrency function formats 2500 as "2 500 ₴" in Ukrainian locale
      expect(screen.getByText(/complete order • 2 500 ₴/i)).toBeInTheDocument();
    });
  });
});
