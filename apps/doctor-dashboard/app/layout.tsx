import type { Metadata } from "next";
import "./globals.css";
import { OrnateMandala, InkSplatterOverlay } from "@packages/ui/src/MandalaBackground";

export const metadata: Metadata = {
  title: "MediKiosk | Physician Dashboard",
  description: "A calm, connected physician workspace",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="watercolor-shell">
          {/* Top-right rotating mandala from unified UI package */}
          <div className="mandala mandala-top">
            <OrnateMandala color="#B8863C" />
          </div>

          {/* Bottom-right counter-rotating mandala from unified UI package */}
          <div className="mandala mandala-bottom">
            <OrnateMandala color="#C9974B" />
          </div>

          {/* Unified ink splatter overlay */}
          <InkSplatterOverlay color="#C9974B" />

          {children}
        </div>
      </body>
    </html>
  );
}
