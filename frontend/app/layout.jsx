import "./globals.css";
import { AppProviders } from "../context/AppProviders";

export const metadata = {
  title: "Nexus — Where Ideas Converge",
  description: "A modern community platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
