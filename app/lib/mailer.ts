import { appendFile, mkdir } from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

type MailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

let transporter: nodemailer.Transporter | null | undefined;

async function writeMailPreview(payload: MailPayload) {
  const directory = path.join(process.cwd(), 'tmp');
  const filePath = path.join(directory, 'mail-preview.log');

  await mkdir(directory, { recursive: true });
  await appendFile(
    filePath,
    `${JSON.stringify({
      createdAt: new Date().toISOString(),
      to: payload.to,
      subject: payload.subject,
      replyTo: payload.replyTo ?? null,
      text: payload.text,
    })}\n`,
    'utf8'
  );
}

function getTransporter() {
  if (transporter !== undefined) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export function isMailConfigured() {
  return Boolean(getTransporter() && process.env.MAIL_FROM);
}

export function getMailDeliveryMode() {
  return isMailConfigured() ? 'smtp' : 'preview';
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function deliverOfficialMail(payload: MailPayload) {
  const activeTransporter = getTransporter();
  const from = process.env.MAIL_FROM;

  if (!activeTransporter || !from) {
    await writeMailPreview(payload);
    return { mode: 'preview' as const };
  }

  await activeTransporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
  });

  return { mode: 'smtp' as const };
}

export async function sendOfficialMail(payload: MailPayload) {
  const result = await deliverOfficialMail(payload);

  if (result.mode !== 'smtp') {
    throw new Error('Official LOKUS email is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM.');
  }
}
