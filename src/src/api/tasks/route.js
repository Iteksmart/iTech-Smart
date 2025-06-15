async function handler({ title, description, status, dueDate }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!title || !status) {
    return { error: "Title and status are required" };
  }

  try {
    const [task] = await sql`
      INSERT INTO tasks (
        user_id,
        title,
        description,
        status,
        due_date,
        created_at,
        updated_at
      ) VALUES (
        ${session.user.id},
        ${title},
        ${description || null},
        ${status},
        ${dueDate ? new Date(dueDate) : null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return { task };
  } catch (error) {
    return { error: "Failed to create task" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}