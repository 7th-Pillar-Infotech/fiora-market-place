import * as React from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    { isOpen, onClose, title, description, children, size = "md", className },
    ref
  ) => {
    const modalRef = React.useRef<HTMLDivElement>(null);

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose]);

    // Handle click outside
    const handleBackdropClick = (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    };

    // Focus management
    React.useEffect(() => {
      if (isOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        }
      }
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: "max-w-md md:max-w-md max-w-[calc(100vw-1rem)]",
      md: "max-w-lg md:max-w-lg max-w-[calc(100vw-1rem)]",
      lg: "max-w-2xl md:max-w-2xl max-w-[calc(100vw-1rem)]",
      xl: "max-w-4xl md:max-w-4xl max-w-[calc(100vw-1rem)]",
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-4 p-2"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className={clsx(
            "relative w-full rounded-xl bg-white shadow-strong animate-scale-in",
            "max-h-[90vh] md:max-h-[80vh] overflow-hidden",
            "md:rounded-xl rounded-lg",
            sizeClasses[size],
            className
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="space-y-1">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-neutral-900"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="text-sm text-neutral-600"
                  >
                    {description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Content */}
          <div
            className={clsx(
              "px-4 md:px-6 overflow-y-auto",
              title || description ? "pb-4 md:pb-6" : "py-4 md:py-6",
              "max-h-[calc(90vh-8rem)] md:max-h-[calc(80vh-8rem)]"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
Modal.displayName = "Modal";

export { Modal };
