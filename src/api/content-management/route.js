async function handler({
  operation,
  type,
  id,
  title,
  content,
  category,
  stepNumber,
  isActive,
  description,
}) {
  switch (operation) {
    case "create":
      switch (type) {
        case "knowledge":
          const [newKnowledge] = await sql`
            INSERT INTO knowledge_base (title, content, category)
            VALUES (${title}, ${content}, ${category})
            RETURNING *`;
          return { success: true, data: newKnowledge };

        case "template":
          const [newTemplate] = await sql`
            INSERT INTO script_templates (title, template_content, category, description)
            VALUES (${title}, ${content}, ${category}, ${description})
            RETURNING *`;
          return { success: true, data: newTemplate };

        case "onboarding":
          const [newOnboarding] = await sql`
            INSERT INTO onboarding_content (title, content, step_number, is_active)
            VALUES (${title}, ${content}, ${stepNumber}, ${isActive})
            RETURNING *`;
          return { success: true, data: newOnboarding };
      }
      break;

    case "read":
      switch (type) {
        case "knowledge":
          if (id) {
            const [knowledge] = await sql`
              SELECT * FROM knowledge_base WHERE id = ${id}`;
            return { success: true, data: knowledge };
          }
          const knowledgeList = await sql`SELECT * FROM knowledge_base`;
          return { success: true, data: knowledgeList };

        case "template":
          if (id) {
            const [template] = await sql`
              SELECT * FROM script_templates WHERE id = ${id}`;
            return { success: true, data: template };
          }
          const templates = await sql`SELECT * FROM script_templates`;
          return { success: true, data: templates };

        case "onboarding":
          if (id) {
            const [onboarding] = await sql`
              SELECT * FROM onboarding_content WHERE id = ${id}`;
            return { success: true, data: onboarding };
          }
          const onboardingContent = await sql`
            SELECT * FROM onboarding_content ORDER BY step_number`;
          return { success: true, data: onboardingContent };
      }
      break;

    case "update":
      switch (type) {
        case "knowledge":
          const [updatedKnowledge] = await sql`
            UPDATE knowledge_base 
            SET title = ${title}, 
                content = ${content}, 
                category = ${category},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *`;
          return { success: true, data: updatedKnowledge };

        case "template":
          const [updatedTemplate] = await sql`
            UPDATE script_templates 
            SET title = ${title}, 
                template_content = ${content}, 
                category = ${category},
                description = ${description},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *`;
          return { success: true, data: updatedTemplate };

        case "onboarding":
          const [updatedOnboarding] = await sql`
            UPDATE onboarding_content 
            SET title = ${title}, 
                content = ${content}, 
                step_number = ${stepNumber},
                is_active = ${isActive},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *`;
          return { success: true, data: updatedOnboarding };
      }
      break;

    case "delete":
      switch (type) {
        case "knowledge":
          await sql`DELETE FROM knowledge_base WHERE id = ${id}`;
          return { success: true };

        case "template":
          await sql`DELETE FROM script_templates WHERE id = ${id}`;
          return { success: true };

        case "onboarding":
          await sql`DELETE FROM onboarding_content WHERE id = ${id}`;
          return { success: true };
      }
      break;

    default:
      return { success: false, error: "Invalid operation" };
  }

  return { success: false, error: "Invalid request" };
}
export async function POST(request) {
  return handler(await request.json());
}