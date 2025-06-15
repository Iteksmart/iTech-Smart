async function handler({
  action,
  teamId,
  userId,
  name,
  role,
  title,
  content,
  steps,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const subscription = await sql`
      SELECT * FROM subscriptions 
      WHERE user_id = ${session.user.id} 
      AND plan_type = 'team'
      AND status = 'active'
      AND current_period_end > NOW()
      LIMIT 1
    `;

    if (!subscription?.length) {
      return { error: "Team features require an active team subscription" };
    }

    switch (action) {
      case "create_team": {
        const result = await sql`
          INSERT INTO teams (name, owner_id)
          VALUES (${name}, ${session.user.id})
          RETURNING id
        `;
        return { success: true, teamId: result[0].id };
      }

      case "add_member": {
        const team = await sql`
          SELECT t.*, COUNT(tm.id) as member_count 
          FROM teams t 
          LEFT JOIN team_members tm ON t.id = tm.team_id 
          WHERE t.id = ${teamId} 
          GROUP BY t.id
        `;

        if (!team?.length || team[0].owner_id !== session.user.id) {
          return { error: "Unauthorized team access" };
        }

        if (team[0].member_count >= 5) {
          return { error: "Team size limit reached" };
        }

        await sql`
          INSERT INTO team_members (team_id, user_id, role)
          VALUES (${teamId}, ${userId}, ${role})
        `;
        return { success: true };
      }

      case "remove_member": {
        const team = await sql`
          SELECT * FROM teams WHERE id = ${teamId} AND owner_id = ${session.user.id}
        `;

        if (!team?.length) {
          return { error: "Unauthorized team access" };
        }

        await sql`
          DELETE FROM team_members 
          WHERE team_id = ${teamId} AND user_id = ${userId}
        `;
        return { success: true };
      }

      case "share_knowledge": {
        const member = await sql`
          SELECT * FROM team_members 
          WHERE team_id = ${teamId} AND user_id = ${session.user.id}
        `;

        if (!member?.length) {
          return { error: "Not a team member" };
        }

        const result = await sql`
          INSERT INTO shared_knowledge (team_id, title, content, created_by)
          VALUES (${teamId}, ${title}, ${content}, ${session.user.id})
          RETURNING id
        `;
        return { success: true, knowledgeId: result[0].id };
      }

      case "create_playbook": {
        const member = await sql`
          SELECT * FROM team_members 
          WHERE team_id = ${teamId} AND user_id = ${session.user.id}
        `;

        if (!member?.length) {
          return { error: "Not a team member" };
        }

        const result = await sql`
          INSERT INTO playbooks (team_id, title, description, steps, created_by)
          VALUES (${teamId}, ${title}, ${content}, ${steps}, ${session.user.id})
          RETURNING id
        `;
        return { success: true, playbookId: result[0].id };
      }

      default:
        return { error: "Invalid action" };
    }
  } catch (error) {
    return { error: "Operation failed" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}