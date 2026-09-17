import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { LoaderProvider, bootScript } from "@/components/loader/loader";
import { FloatingContact } from "@/components/ui/floating-contact";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ascend Designs | Architecture & Interior Design Studio in Ahmedabad",
  description:
    "Ascend Designs is an Ahmedabad-based architecture and interior design studio creating thoughtful residential and commercial spaces through architecture, interiors and turnkey solutions.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Ascend Designs | Architecture & Interior Design Studio in Ahmedabad",
    description:
      "Ascend Designs is an Ahmedabad-based architecture and interior design studio creating thoughtful residential and commercial spaces through architecture, interiors and turnkey solutions.",
    siteName: "Ascend Designs",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface text-ink">
        <Script
          id="ascend-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Script
          id="ascend-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: bootScript }}
        />
        <ThemeProvider>
          <LoaderProvider>
            <SmoothScrollProvider>
              <CustomCursor />
              <Nav />
              {children}
              <Footer />
              <FloatingContact />
            </SmoothScrollProvider>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
