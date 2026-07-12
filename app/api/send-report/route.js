import nodemailer from 'nodemailer';

// POST body: { pdfBase64: string, filename: string, sendEmail: bool, sendTelegram: bool }
export async function POST(req) {
  const { pdfBase64, filename, sendEmail, sendTelegram } = await req.json();
  const results = {};

  if (sendEmail) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD, // Gmail "App Password", not your real password
        },
      });
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.REPORT_EMAIL_TO || process.env.GMAIL_USER,
        subject: `LifeLog report - ${filename}`,
        text: 'Attached: today\'s LifeLog report.',
        attachments: [{ filename, content: pdfBase64, encoding: 'base64' }],
      });
      results.email = 'sent';
    } catch (e) {
      results.email = `error: ${e.message}`;
    }
  }

  if (sendTelegram) {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const form = new FormData();
      form.append('chat_id', chatId);
      const buffer = Buffer.from(pdfBase64, 'base64');
      form.append('document', new Blob([buffer], { type: 'application/pdf' }), filename);
      const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      results.telegram = data.ok ? 'sent' : `error: ${JSON.stringify(data)}`;
    } catch (e) {
      results.telegram = `error: ${e.message}`;
    }
  }

  return Response.json(results);
}
