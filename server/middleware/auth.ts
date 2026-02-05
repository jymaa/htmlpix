import {
  validateApiKey,
  type AuthResult as ConvexAuthResult,
  type AuthSuccess as ConvexAuthSuccess,
} from "../sync/convexClient";
import type { Id } from "../../convex/_generated/dataModel";

export interface ApiKey {
  id: Id<"apiKeys">;
  userId: string;
  keyHash: string;
  keyPrefix: string;
  name: string;
  active: boolean;
  createdAt: number;
}

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
      NOT_READY: 503,
    };

    return {
      authenticated: false,
      status: statusMap[result.code] || 401,
      response: { code: result.code, message: result.message },
    };
  }

  return {
    authenticated: true,
    apiKey: {
      id: result.apiKey._id,
      userId: result.apiKey.userId,
      keyHash: result.apiKey.keyHash,
      keyPrefix: result.apiKey.keyPrefix,
      name: result.apiKey.name,
      active: result.apiKey.active,
      createdAt: result.apiKey.createdAt,
    },
    usageThisMonth: result.usageThisMonth,
  };
}
