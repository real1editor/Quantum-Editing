// api/telegram.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payload = req.body || {};
    const type = payload.type || 'project';
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    let text = `🌌 New 3045 Event — type: ${type}\nSource: ${payload.source || 'web'}\n\n`;
    if (type === 'subscribe') {
      text += `📧 Subscribe request: ${payload.email || '[no email]'}\n`;
    } else if (type === 'feedback') {
      text += `👤 Name: ${payload.name || 'Anonymous'}\n💬 Message:\n${payload.message || '[empty]'}\n`;
    } else { // project
      text += `👤 Name: ${payload.name || 'Anonymous'}\n📧 Email: ${payload.email || '[no email]'}\n💡 Project:\n${payload.message || payload.project || '[empty]'}\n`;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const json = await resp.json();
    if (!json.ok) {
      console.error('Telegram API error', json);
      return res.status(502).json({ error: json.description || 'Telegram API error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Server error', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
