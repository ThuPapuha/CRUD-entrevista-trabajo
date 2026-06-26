"use client";

import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || "http://localhost:3001",
  response_type: "code",
  scope: "email openid phone",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

export default function CognitoAuthProvider({ children }) {
  if (!cognitoAuthConfig.authority || !cognitoAuthConfig.client_id) {
    return children;
  }

  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
