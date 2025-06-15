// pages/api/helpdesk/jira.js
export default async function handler(req, res) {
  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString("base64");

  const response = await fetch(
    `https://${process.env.JIRA_DOMAIN}/rest/api/3/search?jql=assignee=currentuser() AND status!=Done`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch Jira tickets" });
  }

  const data = await response.json();
  res.status(200).json(data.issues);
}

// pages/api/helpdesk/connectwise.js
export default async function handler(req, res) {
  const baseUrl = process.env.CW_BASE_URL;
  const companyId = process.env.CW_COMPANY;
  const publicKey = process.env.CW_PUBLIC_KEY;
  const privateKey = process.env.CW_PRIVATE_KEY;
  const auth = Buffer.from(`${companyId}+${publicKey}:${privateKey}`).toString("base64");

  const response = await fetch(`${baseUrl}/service/tickets`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch ConnectWise tickets" });
  }

  const data = await response.json();
  res.status(200).json(data);
}

// pages/api/helpdesk/zendesk.js
export default async function handler(req, res) {
  const subdomain = process.env.ZD_SUBDOMAIN;
  const email = process.env.ZD_EMAIL;
  const apiToken = process.env.ZD_API_TOKEN;

  const auth = Buffer.from(`${email}/token:${apiToken}`).toString("base64");

  const response = await fetch(`https://${subdomain}.zendesk.com/api/v2/tickets.json`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch Zendesk tickets" });
  }

  const data = await response.json();
  res.status(200).json(data.tickets);
}
