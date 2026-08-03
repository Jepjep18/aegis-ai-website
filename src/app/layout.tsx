import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aegis-ai.app"), // Change this after purchasing your domain

  title: {
    default: "Aegis AI",
    template: "%s | Aegis AI",
  },

  description:
    "AI Interview Copilot built for software engineers. Upload your resume, paste the job description, and receive personalized interview answers in real time.",

  keywords: [
    "AI Interview",
    "Interview Copilot",
    "Software Engineer",
    "Technical Interview",
    "Resume",
    "Job Description",
    "Next.js",
    "OpenAI",
    "Claude",
    "Gemini",
  ],

  authors: [
    {
      name: "Jefferson Arnado",
    },
  ],

  creator: "Jefferson Arnado",

  publisher: "Aegis AI",

  openGraph: {
    title: "Aegis AI",

    description:
      "AI Interview Copilot built for software engineers.",

    url: "https://aegis-ai.app",

    siteName: "Aegis AI",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.png",

        width: 1200,

        height: 630,

        alt: "Aegis AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Aegis AI",

    description:
      "AI Interview Copilot built for software engineers.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",

    shortcut: "/favicon.ico",

    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,

    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}