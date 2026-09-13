import nodemailer from "nodemailer";
import { buildWelcomeEmail } from "../templates/welcome-email.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getTransport() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
    });
}

export function isValidEmail(email) {
    return emailPattern.test(String(email || "").trim());
}

export async function sendWelcomeEmail(email) {
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    const { subject, text, html } = buildWelcomeEmail({ email });
    const transport = getTransport();

    if (!transport || !from) {
        console.warn("[newsletter] SMTP not configured — welcome email not sent.", { email, subject });
        return { sent: false, skipped: true };
    }

    await transport.sendMail({
        from,
        to: email,
        subject,
        text,
        html
    });

    return { sent: true, skipped: false };
}
