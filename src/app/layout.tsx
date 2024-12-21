import type { Metadata } from "next";
import "./globals.css";
import { notoSans, notoSerif, inter, roboto } from "@/lib/fonts";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeDataProvider from "@/context/theme-data-provider";

export const metadata: Metadata = {
  title: "RewardWale - Review honestly Rate diligently Earn Rewards",
  description:
    "Share your experiences about products and services in 2 minute video reviews. Rate business, products and services based on your experience. Engage with your favourite brands 1-on-1. Get rewarded with special offers, cash, coupons and discounts from brands directly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSans.className} ${notoSerif.variable} ${inter.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeDataProvider>{children}</ThemeDataProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
