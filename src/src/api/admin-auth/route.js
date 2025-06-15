async function handler({ action, username, password, newPassword, token }) {
  if (!action) {
    return { success: false, error: "Action is required" };
  }

  if (action === "verify") {
    if (!token) {
      console.log("Token verification failed: No token provided");
      return { success: false, error: "Token is required" };
    }

    try {
      // Verify token by checking if admin exists with this username
      const [admin] = await sql`
        SELECT id, username, last_login 
        FROM admin_accounts 
        WHERE username = ${token}
        AND last_login IS NOT NULL
      `;

      if (!admin) {
        console.log(
          "Token verification failed: Admin not found or never logged in"
        );
        return { success: false, error: "Invalid token" };
      }

      return {
        success: true,
        user: {
          id: admin.id,
          username: admin.username,
          role: "admin",
          last_login: admin.last_login,
        },
      };
    } catch (error) {
      console.error("Token verification error:", error);
      return { success: false, error: "Token verification failed" };
    }
  }

  if (action === "login") {
    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    try {
      // Get admin account
      const [admin] = await sql`
        SELECT id, username, password_hash, last_login
        FROM admin_accounts 
        WHERE username = ${username}
      `;

      if (!admin) {
        console.log("Login failed: Admin not found");
        return { success: false, error: "Invalid credentials" };
      }

      // Verify password
      const match = await fetch("https://api.create.xyz/bcrypt/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          hash: admin.password_hash,
        }),
      }).then((r) => r.json());

      if (!match) {
        console.log("Login failed: Password mismatch");
        return { success: false, error: "Invalid credentials" };
      }

      // Update last login time
      await sql`
        UPDATE admin_accounts 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ${admin.id}
      `;

      // Return success with username as token
      return {
        success: true,
        token: admin.username,
        user: {
          id: admin.id,
          username: admin.username,
          role: "admin",
          last_login: admin.last_login,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Authentication failed" };
    }
  }

  if (action === "update_password") {
    if (!username || !password || !newPassword) {
      return {
        success: false,
        error: "Username, current password and new password are required",
      };
    }

    try {
      const [admin] = await sql`
        SELECT * FROM admin_accounts 
        WHERE username = ${username}
      `;

      if (!admin) {
        return { success: false, error: "Invalid credentials" };
      }

      const match = await fetch("https://api.create.xyz/bcrypt/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          hash: admin.password_hash,
        }),
      }).then((r) => r.json());

      if (!match) {
        return { success: false, error: "Current password is incorrect" };
      }

      const newHash = await fetch("https://api.create.xyz/bcrypt/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPassword,
        }),
      }).then((r) => r.json());

      if (!newHash) {
        console.error("Password hashing failed");
        return { success: false, error: "Password update failed" };
      }

      await sql`
        UPDATE admin_accounts 
        SET password_hash = ${newHash}, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${admin.id}
      `;

      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);
      return { success: false, error: "Password update failed" };
    }
  }

  return { success: false, error: "Invalid action" };
}
export async function POST(request) {
  return handler(await request.json());
}