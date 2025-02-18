import type { Metadata } from "next";
import "./globals.css";
import { notoSans, notoSerif, inter, roboto } from "@/lib/fonts";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeDataProvider from "@/context/theme-data-provider";
import LayoutWrapper from "@/components/layout/layout-wrapper";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Script from "next/script";
import { GoogleAnalytics } from "@/lib/analytics";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "RewardWale - Review honestly Rate diligently Earn Rewards",
  description:
    "Share your experiences about products and services in 2-minute video reviews. Rate business, products, and services based on your experience. Engage with your favorite brands 1-on-1. Get rewarded with special offers, cash, coupons, and discounts from brands directly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NEXT_PUBLIC_ENV === "production";
  return (
    <html
      lang="en"
      className={`${notoSans.className} ${notoSerif.variable} ${inter.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <head>
        {process.env.NEXT_PUBLIC_ENV === "uat" ? (
          <meta name="robots" content="noindex" />
        ) : process.env.NEXT_PUBLIC_ENV === "development" ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta
            name="google-site-verification"
            content="DEIRrbWosKczqXEVZHLW-9aDo_oF3p8iqe4Ndl_kPyY"
          />
        )}

        {/* Google Analytics (GA4) */}
        {isProduction && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-09WN6WQ9P6', {
                page_path: window.location.pathname,
              });
            `,
              }}
            />
            <GoogleAnalytics />
          </>
        )}
      </head>
      {isProduction && <GoogleTagManager gtmId="GTM-PTD4M7JZ" />}
      <body className="max-sm:overscroll-none">
        {isProduction && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PTD4M7JZ"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        <Toaster position="top-center" richColors />
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeDataProvider>
            <LayoutWrapper>
              <GoogleOAuthProvider
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
              >
                <div className="container mx-auto">{children}</div>
              </GoogleOAuthProvider>
            </LayoutWrapper>
          </ThemeDataProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
