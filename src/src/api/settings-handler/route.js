async function handler({
  method,
  action,
  key,
  value,
  type,
  description,
  adminId,
  featureName,
  isEnabled,
  keyId,
  keyName,
  serviceType,
}) {
  if (method !== "POST") {
    return { error: "Method not allowed" };
  }

  switch (action) {
    case "getSetting": {
      const result = await sql`
        SELECT setting_value, setting_type, description 
        FROM app_settings 
        WHERE setting_key = ${key}`;
      return result[0] || { error: "Setting not found" };
    }

    case "getAllSettings": {
      const settings = await sql`
        SELECT setting_key, setting_value, setting_type, description, category 
        FROM app_settings 
        ORDER BY category, setting_key`;
      return { settings };
    }

    case "updateSetting": {
      if (!adminId) return { error: "Admin ID required" };

      await sql`
        SELECT update_setting_with_audit(
          ${key}, 
          ${value}, 
          ${adminId}, 
          ${type || "string"}, 
          ${description}
        )`;
      return { success: true };
    }

    case "getApiKeys": {
      const keys = await sql`
        SELECT id, key_name, service_type, is_active, expires_at, last_rotated_at, environment
        FROM api_keys 
        ORDER BY created_at DESC`;
      return { keys };
    }

    case "rotateApiKey": {
      if (!keyId || !adminId) return { error: "Key ID and Admin ID required" };

      const newKey = await sql`
        SELECT rotate_api_key(${keyId}, ${adminId})`;
      return { newKey: newKey[0].rotate_api_key };
    }

    case "createApiKey": {
      if (!keyName || !serviceType)
        return { error: "Key name and service type required" };

      const keyValue = Buffer.from(crypto.randomBytes(32)).toString("hex");
      const result = await sql`
        INSERT INTO api_keys (key_name, key_value, service_type)
        VALUES (${keyName}, ${keyValue}, ${serviceType})
        RETURNING id`;
      return { id: result[0].id, keyValue };
    }

    case "getFeatureToggles": {
      const features = await sql`
        SELECT feature_name, is_enabled, description, user_type, rollout_percentage, conditions
        FROM feature_toggles
        ORDER BY feature_name`;
      return { features };
    }

    case "updateFeatureToggle": {
      if (!featureName) return { error: "Feature name required" };

      await sql`
        INSERT INTO feature_toggles (feature_name, is_enabled)
        VALUES (${featureName}, ${isEnabled})
        ON CONFLICT (feature_name) 
        DO UPDATE SET 
          is_enabled = ${isEnabled},
          updated_at = CURRENT_TIMESTAMP`;
      return { success: true };
    }

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}