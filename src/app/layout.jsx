import "./globals.css";
import { CartProvider } from "../hooks/useCart";

export const metadata = {
  title: "لرنیا",
  description: "با هوش مصنوعی بهترین خودت شو",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <CartProvider>
        <body className={`antialiased`}>
          {children}
        </body>
      </CartProvider>
    </html>
  );
}