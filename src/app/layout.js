import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blog Website - Chia sẻ kiến thức và trải nghiệm",
  description: "Nền tảng blog hiện đại với đầy đủ tính năng đăng bài, tìm kiếm và chia sẻ nội dung",
  keywords: "blog, viết blog, chia sẻ, kiến thức, trải nghiệm",
  authors: [{ name: "Blog Website Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Blog Website</h3>
              <p className="text-gray-400 mb-4">
                Nơi chia sẻ kiến thức và trải nghiệm thú vị
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <span>© 2024 Blog Website. All rights reserved.</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
