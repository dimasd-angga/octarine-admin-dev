"use client";

import { AuthBindings } from "@refinedev/core";
import nookies from "nookies";
import { jwtDecode } from "jwt-decode";
import { TOKEN_KEY } from "@utils/constants";

const API_URL = "https://octarinedev.mhafizsir.com/";
const COOKIE_NAME = "auth_token";

interface JwtPayload {
  sub: string;
  roles: string[];
  permission: string[];
  iat: number;
  exp: number;
  username?: string;
}

export const authProvider: AuthBindings = {
  login: async ({ email, password, remember }) => {
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        console.log("Login Token:", data.token);
        localStorage.setItem(TOKEN_KEY, data.token);

        nookies.set(null, COOKIE_NAME, data.token, {
          maxAge: remember ? 3600 : undefined,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        });

        return {
          success: true,
          redirectTo: "/banner",
        };
      }

      return {
        success: false,
        error: new Error(data.message || "Invalid credentials"),
      };
    } catch (error) {
      return {
        success: false,
        error: new Error("Login failed"),
      };
    }
  },

  logout: async () => {
    try {
      // Optional: Call logout API if required by your backend
      // const token = localStorage.getItem(TOKEN_KEY);
      // if (token) {
      //   await fetch(`${API_URL}admin/auth/logout`, {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      // }

      // Clear both localStorage and cookie
      localStorage.removeItem(TOKEN_KEY);
      nookies.destroy(null, COOKIE_NAME, { path: "/" });

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: new Error("Logout failed"),
      };
    }
  },

  check: async () => {
    const token =
      localStorage.getItem(TOKEN_KEY) || nookies.get(null)[COOKIE_NAME];
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem(TOKEN_KEY);
          nookies.destroy(null, COOKIE_NAME, { path: "/" });
          return {
            authenticated: false,
            redirectTo: "/login",
          };
        }
        return {
          authenticated: true,
          redirectTo: "/banner",
        };
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        nookies.destroy(null, COOKIE_NAME, { path: "/" });
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }
    }
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getIdentity: async () => {
    const token =
      localStorage.getItem(TOKEN_KEY) || nookies.get(null)[COOKIE_NAME];
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        return {
          id: decoded.sub,
          username: decoded.username || decoded.sub,
        };
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  getPermissions: async () => {
    const token =
      localStorage.getItem(TOKEN_KEY) || nookies.get(null)[COOKIE_NAME];
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        return {
          roles: decoded.roles || [],
          permissions: decoded.permission || [],
        };
      } catch (error) {
        return { roles: [], permissions: [] };
      }
    }
    return { roles: [], permissions: [] };
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      nookies.destroy(null, COOKIE_NAME, { path: "/" });
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }
    return { error };
  },
};
