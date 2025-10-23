import * as React from "react";
import Link from "next/link";
import { Heart, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Delivery Info", href: "/delivery" },
      { name: "Returns", href: "/returns" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Refund Policy", href: "/refunds" },
    ],
  };

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Fiora</span>
            </div>
            <p className="text-neutral-600 text-sm mb-4">
              Kyiv&apos;s premier flower marketplace connecting you with local
              florists for fresh, beautiful arrangements delivered to your door.
            </p>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <MapPin className="h-4 w-4" />
              <span>Kyiv, Ukraine</span>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact section */}
        <div className="py-6 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <Phone className="h-4 w-4" />
                <span>+380 44 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <Mail className="h-4 w-4" />
                <span>support@fiora.ua</span>
              </div>
            </div>
            <div className="text-sm text-neutral-600">
              Available 24/7 for flower emergencies
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-neutral-600">
              © {currentYear} Fiora. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-sm text-neutral-600">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-primary-500 fill-current" />
              <span>in Kyiv</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
