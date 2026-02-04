import { validateApiKey, type ApiKeyResult, type ApiKey } from "../db/apiKeys";

export interface AuthSuccess {
  authenticated: true;
  apiKey: ApiKey;
  usageThisMonth: number;
}

export interface AuthError {
  authenticated: false;
  status: number;
  response: { code: string; message: string };
}

export type AuthResult = AuthSuccess | AuthError;

export function authenticateRequest(req: Request): AuthResult {
  const authHeader = req.headers.get("Authorization");
  const result = validateApiKey(authHeader);

  if (!result.valid) {
    const statusMap: Record<string, number> = {
      MISSING_KEY: 401,
      INVALID_KEY: 401,
      KEY_INACTIVE: 403,
      QUOTA_EXCEEDED: 429,
    };

    return {
      authenticated: false,
      status: statusMap[result.code] || 401,
      response: { code: result.code, message: result.message },
    };
  }

  return {
    authenticated: true,
    apiKey: result.apiKey,
    usageThisMonth: result.usageThisMonth,
  };
}
