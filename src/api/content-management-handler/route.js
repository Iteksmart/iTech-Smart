async function handler({ action, contentType, content, contentId }) {
  try {
    switch (action) {
      case "list":
        switch (contentType) {
          case "knowledge": {
            const result = await sql`
              SELECT * FROM knowledge_base 
              ORDER BY updated_at DESC`;
            return { success: true, content: result };
          }

          case "templates": {
            const result = await sql`
              SELECT * FROM script_templates 
              WHERE is_active = true
              ORDER BY updated_at DESC`;
            return { success: true, content: result };
          }

          case "onboarding": {
            const result = await sql`
              SELECT * FROM onboarding_content 
              WHERE is_active = true
              ORDER BY step_number ASC`;
            return { success: true, content: result };
          }

          default:
            return { success: false, error: "Invalid content type" };
        }

      case "create":
        switch (contentType) {
          case "knowledge": {
            const result = await sql`
              INSERT INTO knowledge_base (
                title, content, category
              ) VALUES (
                ${content.title}, ${content.content}, ${content.category}
              ) RETURNING *`;
            return { success: true, content: result[0] };
          }

          case "templates": {
            const result = await sql`
              INSERT INTO script_templates (
                title, template_content, category
              ) VALUES (
                ${content.title}, ${content.content}, ${content.category}
              ) RETURNING *`;
            return { success: true, content: result[0] };
          }

          case "onboarding": {
            const result = await sql`
              INSERT INTO onboarding_content (
                title, content, step_number
              ) VALUES (
                ${content.title}, ${content.content}, ${content.step_number}
              ) RETURNING *`;
            return { success: true, content: result[0] };
          }

          default:
            return { success: false, error: "Invalid content type" };
        }

      case "update":
        switch (contentType) {
          case "knowledge": {
            const result = await sql`
              UPDATE knowledge_base SET
                title = ${content.title},
                content = ${content.content},
                category = ${content.category},
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ${content.id}
              RETURNING *`;
            return { success: true, content: result[0] };
          }

          case "templates": {
            const result = await sql`
              UPDATE script_templates SET
                title = ${content.title},
                template_content = ${content.content},
                category = ${content.category},
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ${content.id}
              RETURNING *`;
            return { success: true, content: result[0] };
          }

          case "onboarding": {
            const result = await sql`
              UPDATE onboarding_content SET
                title = ${content.title},
                content = ${content.content},
                step_number = ${content.step_number},
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ${content.id}
              RETURNING *`;
            return { success: true, content: result[0] };
          }

          default:
            return { success: false, error: "Invalid content type" };
        }

      case "delete":
        switch (contentType) {
          case "knowledge": {
            await sql`DELETE FROM knowledge_base WHERE id = ${contentId}`;
            return { success: true };
          }

          case "templates": {
            await sql`DELETE FROM script_templates WHERE id = ${contentId}`;
            return { success: true };
          }

          case "onboarding": {
            await sql`DELETE FROM onboarding_content WHERE id = ${contentId}`;
            return { success: true };
          }

          default:
            return { success: false, error: "Invalid content type" };
        }

      default:
        return { success: false, error: "Invalid action" };
    }
  } catch (error) {
    console.error("Content management error:", error);
    return { success: false, error: error.message };
  }
}
export async function POST(request) {
  return handler(await request.json());
}