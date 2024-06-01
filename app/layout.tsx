import type { Metadata } from "next";

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

export const metadata: Metadata = {
  title: "Pass Generator",
  description: "Generate a Pass for Apple Wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider defaultColorScheme='dark'>{children}</MantineProvider>
      </body>
    </html>
  );
}
