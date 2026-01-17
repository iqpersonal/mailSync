import { Telegraf, Context } from "telegraf";
import { config } from "../config/env";

console.log(
  "Bot initialization - Token exists:",
  !!config.telegram.botToken,
  "Token length:",
  config.telegram.botToken?.length || 0
);

export const bot = new Telegraf(config.telegram.botToken);

// Add error handling
bot.catch((err, ctx) => {
  console.error("Bot error:", err, "Context:", ctx.update?.update_id);
});

// Type-safe context
export interface BotContext extends Context {
  session?: {
    userId?: string;
    state?: string;
  };
}

// Initialize bot commands
bot.command("start", async (ctx) => {
  console.log("START command received from chat:", ctx.chat?.id);
  await ctx.reply(
    " *Welcome to MailSync!*\n\n" +
      "I help you manage your emails with AI-powered summaries.\n\n" +
      "Commands:\n" +
      "/connect - Link your Gmail account\n" +
      "/status - Check connection status\n" +
      "/help - Show help",
    { parse_mode: "Markdown" }
  );
});

bot.command("help", async (ctx) => {
  console.log("HELP command received from chat:", ctx.chat?.id);
  await ctx.reply(
    " *MailSync Commands:*\n\n" +
      "/connect - Link Gmail account\n" +
      "/status - View integration status\n" +
      "/settings - Manage preferences\n" +
      "/unlink - Disconnect Gmail",
    { parse_mode: "Markdown" }
  );
});