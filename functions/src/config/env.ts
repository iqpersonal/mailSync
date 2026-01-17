import * as dotenv from "dotenv";
import * as functions from "firebase-functions";

dotenv.config();

// Helper function to safely get config value from functions.config() or process.env
function getConfigValue(path: string, defaultValue: string = ""): string {
  try {
    // Try to get from functions.config() first
    const parts = path.split(".");
    let obj: any = functions.config();
    for (const part of parts) {
      obj = obj[part];
      if (obj === undefined) break;
    }
    if (obj !== undefined) return obj;
  } catch (e) {
    console.warn(`Could not read config path: ${path}`);
  }

  // Fallback to process.env
  const envKey = path.replace(/\./g, "_").toUpperCase();
  return process.env[envKey] || defaultValue;
}

export const config = {
  telegram: {
    botToken:
      getConfigValue("telegram.token") ||
      process.env.TELEGRAM_BOT_TOKEN ||
      "",
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || "",
  },
  openai: {
    apiKey:
      getConfigValue("openai.key") || process.env.OPENAI_API_KEY || "",
  },
  google: {
    clientId:
      getConfigValue("google.clientid") ||
      process.env.GOOGLE_CLIENT_ID ||
      "",
    clientSecret:
      getConfigValue("google.clientsecret") ||
      process.env.GOOGLE_CLIENT_SECRET ||
      "",
    redirectUri:
      getConfigValue("google.redirecturi") ||
      process.env.GOOGLE_REDIRECT_URI ||
      "",
  },
  app: {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },
};

console.log("Config loaded - Bot token starts with:", config.telegram.botToken.substring(0, 5) || "EMPTY");
console.log("Config loaded - OpenAI key starts with:", config.openai.apiKey.substring(0, 5) || "EMPTY");