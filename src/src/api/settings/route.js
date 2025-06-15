async function handler({ method, category, settings, adminId }) {
  if (method === "GET") {
    const query = category
      ? "SELECT * FROM app_settings WHERE category = $1 ORDER BY setting_key"
      : "SELECT * FROM app_settings ORDER BY category, setting_key";

    const values = category ? [category] : [];
    const settings = await sql(query, values);

    return { settings };
  }

  if (method === "PUT" && settings && adminId) {
    const results = [];

    for (const setting of settings) {
      const { key, value, type = "string", description } = setting;

      if (!key || value === undefined) {
        continue;
      }

      let validatedValue = value;

      // Validate value based on type
      switch (type) {
        case "boolean":
          validatedValue = Boolean(value);
          break;
        case "number":
          validatedValue = Number(value);
          if (isNaN(validatedValue)) {
            return { error: `Invalid number value for setting: ${key}` };
          }
          break;
      }

      try {
        const result = await sql.transaction(async (sql) => {
          // Get old value for audit log
          const oldSetting = await sql(
            "SELECT setting_value FROM app_settings WHERE setting_key = $1",
            [key]
          );

          // Update or insert setting
          await sql(
            `INSERT INTO app_settings (
              setting_key, 
              setting_value, 
              setting_type,
              description,
              last_modified_by
            )
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (setting_key) 
            DO UPDATE SET
              setting_value = EXCLUDED.setting_value,
              setting_type = EXCLUDED.setting_type,
              description = COALESCE(EXCLUDED.description, app_settings.description),
              updated_at = CURRENT_TIMESTAMP,
              last_modified_by = EXCLUDED.last_modified_by`,
            [key, validatedValue.toString(), type, description, adminId]
          );

          // Log the change
          await sql(
            `INSERT INTO settings_audit_log (
              setting_key,
              old_value,
              new_value,
              changed_by,
              change_type
            )
            VALUES ($1, $2, $3, $4, $5)`,
            [
              key,
              oldSetting?.[0]?.setting_value,
              validatedValue.toString(),
              adminId,
              oldSetting?.[0] ? "update" : "create",
            ]
          );

          return { key, value: validatedValue };
        });

        results.push(result);
      } catch (error) {
        return { error: `Failed to update setting ${key}: ${error.message}` };
      }
    }

    return { updated: results };
  }

  return { error: "Invalid request" };
}
export async function POST(request) {
  return handler(await request.json());
}