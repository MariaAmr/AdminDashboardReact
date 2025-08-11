// auth.ts
import bcrypt from "bcryptjs";
type User = {
  username: string;
  password: string;
  email?: string;
};

type JwtToken = {
  token: string;
  exp: number; // Expiration time (epoch seconds)
  refreshToken: string;
  refresh_exp: number; // Refresh token expiration (epoch seconds)
};

let refreshTimeout: NodeJS.Timeout | null = null;
// Helper: Convert milliseconds to epoch seconds
const toEpochSeconds = (ms: number) => Math.floor(ms / 1000);

export function updateToken(token: JwtToken): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    if (!token?.token || !token?.refreshToken) {
      return reject(new Error("Invalid token object"));
    }

    setTimeout(() => {
      resolve({
        ...token,
        exp: toEpochSeconds(Date.now() + 3600000), // 1 hour in seconds
        refresh_exp: toEpochSeconds(Date.now() + 7200000), // 2 hours in seconds
      });
    }, 1000);
  });
}
// Mock database
export const usersDB: User[] = [
  {
    username: "admin",
    password: await bcrypt.hash("password", 10), // Hashed password
    email: "admin@example.com",
  },
];

export async function login(credentials: {
  username: string;
  password: string;
}): Promise<{
  token: string;
  username: string;
  exp: number;
  refreshToken: string;
  refresh_exp: number;
}> {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const user = usersDB.find((u) => u.username === credentials.username);

        if (user) {
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (passwordMatch) {
            const token = {
              token: `jwt-token-for-${user.username}`,
              username: user.username,
              exp: toEpochSeconds(Date.now() + 3600000),
              refreshToken: `refresh-token-for-${user.username}`,
              refresh_exp: toEpochSeconds(Date.now() + 7200000),
            };
            resolve(token);
          } else {
            reject(new Error("Invalid username or password"));
          }
        } else {
          reject(new Error("Invalid username or password"));
        }
      }, 1000);
    });
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login service unavailable");
  }
}
export async function register(newUser: {
  username: string;
  password: string;
  email?: string;
}): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // 1. Validate input
      if (!newUser.username || !newUser.password) {
        return reject(new Error("Username and password are required"));
      }

      // 2. Check if user already exists
      const userExists = usersDB.some((u) => u.username === newUser.username);
      if (userExists) {
        return reject(new Error("Username already exists"));
      }

      try {
        // 3. Hash password before storing
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const userToStore: User = {
          username: newUser.username,
          password: hashedPassword, // Store hashed password, NOT plaintext
          email: newUser.email,
        };

        // 4. Add user to DB
        usersDB.push(userToStore);

        // 5. Generate and return JWT token (using epoch seconds)
        const token: JwtToken = {
          token: `jwt-token-for-${newUser.username}`,
          exp: toEpochSeconds(Date.now() + 3600000), // 1 hour in seconds
          refreshToken: `refresh-token-for-${newUser.username}`,
          refresh_exp: toEpochSeconds(Date.now() + 7200000), // 2 hours in seconds
        };

        resolve(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        reject(new Error("Registration failed: " ));
      }
    }, 1000);
  });
}
export function scheduleTokenRefresh(token: JwtToken) {
  if (refreshTimeout) clearTimeout(refreshTimeout);

  const refreshTime = token.exp * 1000 - 60000;
  const timeUntilRefresh = refreshTime - Date.now();

  if (timeUntilRefresh > 0) {
    refreshTimeout = setTimeout(async () => {
      try {
        const newToken = await updateToken(token);
        localStorage.setItem("token", JSON.stringify(newToken));
        scheduleTokenRefresh(newToken);
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Handle logout or retry
      }
    }, timeUntilRefresh);
  }
}

export const validateToken = (token: JwtToken | null): boolean => {
  if (!token) return false;
  return Date.now() < token.exp * 1000; // Convert back to ms for comparison
};
// auth.ts
export async function logout(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
    
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");  // Add this line
      
      // Clear any pending refresh
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }
      
      resolve();
    }, 500);
  });
}
