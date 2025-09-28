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

    // Enhanced message formatting with emojis and better structure
    let text = `🌌 *QUANTUM TRANSMISSION RECEIVED* 🌌\n`;
    text += `⏰ ${new Date().toLocaleString()}\n`;
    text += `📡 Type: ${type.toUpperCase()}\n`;
    text += `🚀 Source: ${payload.source || 'web'}\n\n`;

    if (type === 'subscribe') {
      text += `📧 *NEWSLETTER SUBSCRIPTION*\n`;
      text += `├ Email: ${payload.email || '[no email]'}\n`;
      text += `└ Status: 🟢 ACTIVE\n`;
    } else if (type === 'feedback') {
      text += `💬 *CLIENT FEEDBACK*\n`;
      text += `├ Name: ${payload.name || 'Anonymous'}\n`;
      text += `├ Message:\n`;
      text += `└ ${payload.message || '[empty]'}\n`;
    } else { // project
      text += `🎬 *PROJECT TRANSMISSION*\n`;
      text += `├ Name: ${payload.name || 'Anonymous'}\n`;
      text += `├ Email: ${payload.email || '[no email]'}\n`;
      text += `├ Project Details:\n`;
      text += `└ ${payload.message || payload.project || '[empty]'}\n`;
    }

    text += `\n⚡ *REAL1EDITOR QUANTUM SYSTEM* ⚡`;
    text += `\n📍 Neo-Addis | 3045 Era`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text,
        parse_mode: 'Markdown',
        disable_notification: false
      })
    });

    const json = await resp.json();
    if (!json.ok) {
      console.error('Telegram API error', json);
      return res.status(502).json({ error: json.description || 'Telegram API error' });
    }

    return res.status(200).json({ 
      ok: true,
      message: 'Quantum transmission successful!',
      type: type
    });
  } catch (err) {
    console.error('Server error', err);
    return res.status(500).json({ 
      error: 'Quantum interference detected. Transmission failed.',
      details: err.message 
    });
  }
}
