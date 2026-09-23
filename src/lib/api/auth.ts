import { apiRequest } from "./http";
import type { LoginRequest, LoginResponse } from "./types";

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
};
