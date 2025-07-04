import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bite2Byte",
  description: "Track smarter with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        {/*
        Possible values for runtimeUrl
        - "/api/copilotkit/openai" for OpenAI
        - "/api/copilotkit/groq" for Groq
        - "/api/copilotkit/gemini" for Gemini

        to change the exact model, please visit the route.ts files in the respective folder (app/api/copilotkit)
        */}
        <CopilotKit runtimeUrl="/api/copilotkit/openai">
          <Header />
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}