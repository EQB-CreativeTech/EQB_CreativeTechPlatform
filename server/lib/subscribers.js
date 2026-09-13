import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "subscribers.json");
const TABLE = "newsletter_subscribers";

let supabaseClient = null;

function useSupabase() {
    return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabase() {
    if (!supabaseClient) {
        supabaseClient = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
    }
    return supabaseClient;
}

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

async function ensureStore() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, "[]", "utf8");
    }
}

async function readAll() {
    await ensureStore();
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
}

async function writeAll(emails) {
    await ensureStore();
    await fs.writeFile(DATA_FILE, JSON.stringify(emails, null, 2), "utf8");
}

async function hasSubscriberSupabase(email) {
    const { data, error } = await getSupabase()
        .from(TABLE)
        .select("email")
        .eq("email", email)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return Boolean(data);
}

async function addSubscriberSupabase(email) {
    const { error } = await getSupabase().from(TABLE).insert({ email });

    if (error?.code === "23505") {
        return { added: false, email };
    }

    if (error) {
        throw error;
    }

    return { added: true, email };
}

export async function hasSubscriber(email) {
    const normalized = normalizeEmail(email);
    if (!normalized) {
        return false;
    }

    if (useSupabase()) {
        return hasSubscriberSupabase(normalized);
    }

    const emails = await readAll();
    return emails.includes(normalized);
}

export async function addSubscriber(email) {
    const normalized = normalizeEmail(email);

    if (useSupabase()) {
        return addSubscriberSupabase(normalized);
    }

    const emails = await readAll();
    if (emails.includes(normalized)) {
        return { added: false, email: normalized };
    }
    emails.push(normalized);
    await writeAll(emails);
    return { added: true, email: normalized };
}
