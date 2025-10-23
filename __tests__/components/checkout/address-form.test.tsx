import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddressForm } from "@/components/checkout/address-form";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("AddressForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  const renderAddressForm = (props = {}) => {
    return render(<AddressForm onSubmit={mockOnSubmit} {...props} />);
  };

  describe("Form rendering and basic functionality", () => {
    it("should render all required form fields", () => {
      renderAddressForm();

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /continue to payment/i })
      ).toBeInTheDocument();
    });

    it("should prevent submission with empty required fields", async () => {
      const user = userEvent.setup();
      renderAddressForm();

      const submitButton = screen.getByRole("button", {
        name: /continue to payment/i,
      });
      await user.click(submitButton);

      // Form should not submit with empty fields
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Form input handling", () => {
    it("should update input values when user types", async () => {
      const user = userEvent.setup();
      renderAddressForm();

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const phoneInput = screen.getByLabelText(/phone number/i);

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(phoneInput, "+380501234567");

      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("john@example.com");
      expect(phoneInput).toHaveValue("+380501234567");
    });

    it("should limit postal code input to 5 characters", async () => {
      const user = userEvent.setup();
      renderAddressForm();

      const postalCodeInput = screen.getByLabelText(/postal code/i);
      await user.type(postalCodeInput, "123456789");

      expect(postalCodeInput).toHaveValue("12345");
    });
  });

  describe("Successful form submission", () => {
    it("should submit form with valid data", async () => {
      const user = userEvent.setup();
      renderAddressForm();

      // Fill all required fields with valid data
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/email address/i),
        "john@example.com"
      );
      await user.type(screen.getByLabelText(/phone number/i), "+380501234567");
      await user.type(screen.getByLabelText(/street address/i), "123 Main St");
      await user.type(screen.getByLabelText(/postal code/i), "01001");

      const submitButton = screen.getByRole("button", {
        name: /continue to payment/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          deliveryAddress: {
            street: "123 Main St",
            city: "Kyiv",
            postalCode: "01001",
            coordinates: expect.objectContaining({
              lat: expect.any(Number),
              lng: expect.any(Number),
            }),
          },
          contactInfo: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+380501234567",
          },
          deliveryInstructions: undefined,
        });
      });
    });

    it("should include delivery instructions when provided", async () => {
      const user = userEvent.setup();
      renderAddressForm();

      // Fill all required fields
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/email address/i),
        "john@example.com"
      );
      await user.type(screen.getByLabelText(/phone number/i), "+380501234567");
      await user.type(screen.getByLabelText(/street address/i), "123 Main St");
      await user.type(screen.getByLabelText(/postal code/i), "01001");

      // Add delivery instructions
      const instructionsTextarea = screen.getByPlaceholderText(
        /any special instructions/i
      );
      await user.type(instructionsTextarea, "Leave at front door");

      const submitButton = screen.getByRole("button", {
        name: /continue to payment/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          deliveryAddress: expect.any(Object),
          contactInfo: expect.any(Object),
          deliveryInstructions: "Leave at front door",
        });
      });
    });
  });

  describe("External errors display", () => {
    it("should display external errors passed as props", () => {
      const errors = {
        name: "External name error",
        email: "External email error",
      };

      renderAddressForm({ errors });

      expect(screen.getByText("External name error")).toBeInTheDocument();
      expect(screen.getByText("External email error")).toBeInTheDocument();
    });
  });

  describe("Address validation scenarios", () => {
    it("should handle invalid email format", async () => {
      const user = userEvent.setup();
      renderAddressForm();

      // Fill required fields but with invalid email
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(screen.getByLabelText(/email address/i), "invalid-email");
      await user.type(screen.getByLabelText(/phone number/i), "+380501234567");
      await user.type(screen.getByLabelText(/street address/i), "123 Main St");
      await user.type(screen.getByLabelText(/postal code/i), "01001");

      const submitButton = screen.getByRole("button", {
        name: /continue to payment/i,
      });
      await user.click(submitButton);

      // Should not submit with invalid email
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should handle invalid phone format", async () => {
      const user = userEvent.setup();
      renderAddressForm();

      // Fill required fields but with invalid phone
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/email address/i),
        "john@example.com"
      );
      await user.type(screen.getByLabelText(/phone number/i), "123");
      await user.type(screen.getByLabelText(/street address/i), "123 Main St");
      await user.type(screen.getByLabelText(/postal code/i), "01001");

      const submitButton = screen.getByRole("button", {
        name: /continue to payment/i,
      });
      await user.click(submitButton);

      // Should not submit with invalid phone
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should handle invalid postal code format", async () => {
      const user = userEvent.setup();
      renderAddressForm();

      // Fill required fields but with invalid postal code
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/email address/i),
        "john@example.com"
      );
      await user.type(screen.getByLabelText(/phone number/i), "+380501234567");
      await user.type(screen.getByLabelText(/street address/i), "123 Main St");
      await user.type(screen.getByLabelText(/postal code/i), "123");

      const submitButton = screen.getByRole("button", {
        name: /continue to payment/i,
      });
      await user.click(submitButton);

      // Should not submit with invalid postal code
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
