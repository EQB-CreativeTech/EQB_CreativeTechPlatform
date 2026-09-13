import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { addSubscriber, hasSubscriber } from "./lib/subscribers.js";
import { isValidEmail, sendWelcomeEmail } from "./lib/mail.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3847);
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:8080,http://127.0.0.1:8080")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error("Not allowed by CORS"));
        }
    })
);
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});

app.post("/api/newsletter/subscribe", async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email) {
        res.status(400).json({
            ok: false,
            code: "invalid_email",
            message: "Enter your email address."
        });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({
            ok: false,
            code: "invalid_email",
            message: "Enter a valid email address."
        });
        return;
    }

    try {
        if (await hasSubscriber(email)) {
            res.status(409).json({
                ok: false,
                code: "already_subscribed",
                message: "This email is already subscribed."
            });
            return;
        }

        let mailResult;
        try {
            mailResult = await sendWelcomeEmail(email);
        } catch (mailError) {
            console.error("[newsletter] Failed to send welcome email:", mailError);
            res.status(502).json({
                ok: false,
                code: "email_failed",
                message: "We could not send the welcome email. Please try again in a moment."
            });
            return;
        }

        if (mailResult.skipped) {
            res.status(503).json({
                ok: false,
                code: "email_not_configured",
                message: "Newsletter email is not configured on the server yet."
            });
            return;
        }

        const result = await addSubscriber(email);
        if (!result.added) {
            res.status(409).json({
                ok: false,
                code: "already_subscribed",
                message: "This email is already subscribed."
            });
            return;
        }

        res.status(201).json({
            ok: true,
            message: "Thanks for subscribing. Check your inbox for a confirmation email."
        });
    } catch (error) {
        console.error("[newsletter] Subscribe error:", error);
        res.status(500).json({
            ok: false,
            code: "server_error",
            message: "Something went wrong. Please try again in a moment."
        });
    }
});

app.listen(port, () => {
    console.log(`EQB newsletter API listening on http://localhost:${port}`);
});
