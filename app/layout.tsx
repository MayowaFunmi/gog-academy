import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { gilroy } from "./fonts/fonts";
import { ToastContainer } from "react-toastify";
import AuthSessionProvider from "./providers/AuthSessionProvider";
import ReactQueryProvider from "./providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Gospel Of Grace Academy",
  description: "A platform for spiritual learning and growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-full h-full bg-white antialiased`}
        style={{ ...gilroy.style }}
      >
        <ToastContainer />
        <AuthSessionProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
