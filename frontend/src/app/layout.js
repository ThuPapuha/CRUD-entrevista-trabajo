import "./globals.css";
import CognitoAuthProvider from "./auth-provider";

export const metadata = {
  title: "CRUD Registros",
  description: "UI para microservicio CRUD"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CognitoAuthProvider>{children}</CognitoAuthProvider>
      </body>
    </html>
  );
}
