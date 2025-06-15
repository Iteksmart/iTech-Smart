async function handler({ method, action, data }) {
  try {
    const session = getSession();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    switch (method) {
      case "GET": {
        if (action === "search") {
          const { query, category } = data;
          let queryStr = "SELECT * FROM knowledge_base WHERE 1=1";
          const values = [];
          let paramCount = 1;

          if (query) {
            queryStr += ` AND (LOWER(title) LIKE LOWER($${paramCount}) OR LOWER(content) LIKE LOWER($${paramCount}))`;
            values.push(`%${query}%`);
            paramCount++;
          }

          if (category) {
            queryStr += ` AND category = $${paramCount}`;
            values.push(category);
          }

          const articles = await sql(queryStr, values);
          return { articles };
        }

        const articles = await sql`
          SELECT * FROM knowledge_base 
          ORDER BY created_at DESC
        `;
        return { articles };
      }

      case "POST": {
        const { title, content, category } = data;
        if (!title || !content || !category) {
          return { error: "Missing required fields" };
        }

        const result = await sql`
          INSERT INTO knowledge_base (title, content, category)
          VALUES (${title}, ${content}, ${category})
          RETURNING *
        `;
        return { article: result[0] };
      }

      case "PUT": {
        const { id, title, content, category } = data;
        if (!id || !title || !content || !category) {
          return { error: "Missing required fields" };
        }

        const result = await sql`
          UPDATE knowledge_base 
          SET title = ${title}, 
              content = ${content}, 
              category = ${category},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `;
        return { article: result[0] };
      }

      case "DELETE": {
        const { id } = data;
        if (!id) {
          return { error: "Article ID required" };
        }

        await sql`
          DELETE FROM knowledge_base 
          WHERE id = ${id}
        `;
        return { success: true };
      }

      case "ANALYTICS": {
        const { type, articleId } = data;

        if (type === "categories") {
          const categories = await sql`
            SELECT category, COUNT(*) as count 
            FROM knowledge_base 
            GROUP BY category
          `;
          return { categories };
        }

        if (type === "popular") {
          const popular = await sql`
            SELECT * FROM knowledge_base 
            ORDER BY created_at DESC 
            LIMIT 5
          `;
          return { popular };
        }

        if (type === "view" && articleId) {
          await sql`
            UPDATE knowledge_base 
            SET views = views + 1 
            WHERE id = ${articleId}
          `;
          return { success: true };
        }

        return { error: "Invalid analytics type" };
      }

      default:
        return { error: "Method not allowed" };
    }
  } catch (error) {
    console.error("Knowledge base error:", error);
    return { error: "Internal server error" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}