import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://arogyarx.com"),
  title: {
    default: "ArogyaRx - Online Pharmacy & Healthcare Platform | Buy Medicines, Book Lab Tests & Consult Doctors",
    template: "%s | ArogyaRx"
  },
  description: "ArogyaRx is India's trusted online pharmacy and healthcare platform. Buy medicines online, book lab tests at home, consult with verified doctors, and get doorstep delivery. Your complete healthcare solution.",
  keywords: [
    "online pharmacy",
    "buy medicines online",
    "book lab tests",
    "consult doctors online",
    "healthcare platform",
    "medicine delivery",
    "ArogyaRx",
    "prescription medicines",
    "OTC medicines",
    "health checkup",
    "online doctor consultation",
    "home lab tests",
    "pharmacy near me"
  ],
  authors: [{ name: "ArogyaRx" }],
  creator: "ArogyaRx",
  publisher: "ArogyaRx",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://arogyarx.com",
    title: "ArogyaRx - Online Pharmacy & Healthcare Platform",
    description: "Buy medicines online, book lab tests, and consult with doctors. India's trusted healthcare platform with doorstep delivery.",
    siteName: "ArogyaRx",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ArogyaRx - Your Healthcare Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArogyaRx - Online Pharmacy & Healthcare Platform",
    description: "Buy medicines online, book lab tests, and consult with doctors. India's trusted healthcare platform with doorstep delivery.",
    images: ["/logo.png"],
    creator: "@arogyarx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://arogyarx.com",
  },
  category: "healthcare",
}

