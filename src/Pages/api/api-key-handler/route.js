async function handler({
  action,
  keyId,
  keyName,
  serviceType,
  rotationInterval,
  adminId,
}) {
  try {
    switch (action) {
      case "list":
        const keys = await sql`
          SELECT 
            id, 
            key_name,
            masked_value,
            service_type,
            is_active,
            created_at,
            expires_at,
            last_rotated_at,
            rotation_interval,
            needs_rotation
          FROM api_keys
          ORDER BY created_at DESC
        `;
        return { keys };

      case "create":
        const keyValue = Buffer.from(crypto.randomBytes(32)).toString("hex");
        const maskedValue = `${keyValue.substring(0, 8)}...${keyValue.substring(
          keyValue.length - 8
        )}`;

        const newKey = await sql`
          INSERT INTO api_keys (
            key_name,
            key_value,
            masked_value,
            service_type,
            rotation_interval
          ) VALUES (
            ${keyName},
            ${keyValue},
            ${maskedValue},
            ${serviceType},
            ${rotationInterval || 30}
          )
          RETURNING id, key_name, masked_value, service_type, created_at
        `;

        return {
          key: newKey[0],
          fullKey: keyValue,
        };

      case "rotate":
        const rotated = await sql`
          SELECT * FROM rotate_api_key(${keyId}, ${adminId})
        `;

        if (!rotated?.length) {
          return { error: "Failed to rotate API key" };
        }

        return {
          newKey: rotated[0].rotate_api_key,
          message: "API key rotated successfully",
        };

      case "delete":
        await sql`
          DELETE FROM api_keys 
          WHERE id = ${keyId}
        `;

        return {
          message: "API key deleted successfully",
        };

      default:
        return {
          error: "Invalid action",
        };
    }
  } catch (error) {
    return {
      error: "Failed to process API key operation",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}