import { BotContext, bot } from "./index";
import { db } from "../config/firebase";
import { fetchRecentEmails, getGmailClient, sendEmail, setupGmailWatch, stopGmailWatch, getEmailById, searchEmails } from "../services/gmail";
import { summarizeEmail, generateReply } from "../services/openai";

// Store email context in Firestore for persistence across function invocations
async function storeEmailContext(chatId: number, emailId: string, data: { subject: string; from: string; body: string }) {
  await db.collection("emailContexts").doc(`${chatId}_${emailId}`).set({
    chatId,
    emailId,
    subject: data.subject,
    from: data.from,
    body: data.body,
    createdAt: new Date(),
  });
}

async function getEmailContext(chatId: number, emailId: string) {
  const doc = await db.collection("emailContexts").doc(`${chatId}_${emailId}`).get();
  if (!doc.exists) return null;
  return doc.data();
}

async function deleteEmailContext(chatId: number, emailId: string) {
  await db.collection("emailContexts").doc(`${chatId}_${emailId}`).delete();
}

bot.command("start", async (ctx: BotContext) => {
  await ctx.reply(
    " *Welcome to MailSync!*\n\n" +
      "I'm your AI-powered email assistant. I'll help you manage your emails directly from Telegram.\n\n" +
      " *Get Started:*\n" +
      "1. Use /connect to link your Gmail\n" +
      "2. Use /watch to enable real-time notifications\n" +
      "3. Receive AI summaries and reply instantly!\n\n" +
      "Type /help to see all commands.",
    { parse_mode: "Markdown" }
  );
});

bot.command("connect", async (ctx: BotContext) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const authUrl = `https://us-central1-atscv-673b8.cloudfunctions.net/gmailAuth/auth?telegram_chat_id=${chatId}`;

  await ctx.reply(
    " *Connect Your Gmail Account*\n\n" +
      "Click the button below to authorize MailSync:\n\n",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: " Connect Gmail", url: authUrl }]],
      },
    }
  );
});

bot.command("status", async (ctx: BotContext) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  try {
    const userSnapshot = await db
      .collection("users")
      .where("telegramChatId", "==", chatId)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      await ctx.reply(" No account linked. Use /connect to get started.");
      return;
    }

    const user = userSnapshot.docs[0].data();
    const integrationSnapshot = await db
      .collection("integrations")
      .where("userId", "==", userSnapshot.docs[0].id)
      .where("provider", "==", "google")
      .limit(1)
      .get();

    if (integrationSnapshot.empty) {
      await ctx.reply(" Gmail not connected. Use /connect to link your account.");
      return;
    }

    const integration = integrationSnapshot.docs[0].data();
    const status = integration.isActive ? " Active" : " Inactive";
    const watchStatus = integration.gmailWatch?.active ? " Enabled" : " Disabled";
    
    let watchExpiry = "";
    if (integration.gmailWatch?.expiration) {
      const expDate = new Date(parseInt(integration.gmailWatch.expiration));
      watchExpiry = `\nWatch Expires: ${expDate.toLocaleDateString()}`;
    }

    await ctx.reply(
      ` *Account Status*\n\n` +
        `Email: ${user.email}\n` +
        `Status: ${status}\n` +
        `Subscription: ${user.subscriptionStatus}\n` +
        `Push Notifications: ${watchStatus}${watchExpiry}\n\n` +
        `Email Quota: ${user.emailQuota?.used || 0}/${user.emailQuota?.limit || 50}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Status command error:", error);
    await ctx.reply(" Error fetching status. Please try again.");
  }
});

bot.command("check", async (ctx: BotContext) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  try {
    await ctx.reply(" Checking your recent emails...");

    const userSnapshot = await db
      .collection("users")
      .where("telegramChatId", "==", chatId)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      await ctx.reply(" No account linked. Use /connect first.");
      return;
    }

    const userId = userSnapshot.docs[0].id;
    const integrationSnapshot = await db
      .collection("integrations")
      .where("userId", "==", userId)
      .where("provider", "==", "google")
      .limit(1)
      .get();

    if (integrationSnapshot.empty) {
      await ctx.reply(" Gmail not connected. Use /connect first.");
      return;
    }

    const integration = integrationSnapshot.docs[0].data();
    const gmail = await getGmailClient(
      integration.accessToken,
      integration.refreshToken
    );

    const emails = await fetchRecentEmails(gmail, 5);

    if (emails.length === 0) {
      await ctx.reply(" No new emails found!");
      return;
    }

    await ctx.reply(` Found ${emails.length} recent email(s). Summarizing...`);

    for (const email of emails) {
      try {
        const summary = await summarizeEmail(
          email.subject,
          email.snippet,
          email.from
        );

        const message =
          ` *New Email*\n\n` +
          `*From:* ${email.from}\n` +
          `*Subject:* ${email.subject}\n\n` +
          `*AI Summary:*\n${summary}`;

        await storeEmailContext(chatId, email.id, {
          subject: email.subject,
          from: email.from,
          body: email.body || email.snippet,
        });

        await ctx.reply(message, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: " Generate Reply", callback_data: `reply_${email.id}` },
                { text: " Custom Reply", callback_data: `custom_${email.id}` },
              ],
            ],
          },
        });

        await db.collection("threads").add({
          threadId: email.threadId,
          userId: userId,
          subject: email.subject,
          from: email.from,
          aiSummary: summary,
          status: "processed",
          telegramMessageId: null,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error processing email:", error);
        await ctx.reply(` Failed to process email: ${email.subject}`);
      }
    }

    await ctx.reply(" All emails processed!");
  } catch (error) {
    console.error("Check command error:", error);
    await ctx.reply(" Error checking emails. Please try again later.");
  }
});

// Search command
bot.command("search", async (ctx: BotContext) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const query = (ctx.message as any)?.text?.replace("/search", "").trim();
  
  if (!query) {
    await ctx.reply(
      " *Email Search*\n\n" +
        "Usage: `/search <keyword>`\n\n" +
        "Examples:\n" +
        " `/search invoice`\n" +
        " `/search from:john@example.com`\n" +
        " `/search subject:meeting`\n" +
        " `/search after:2026/01/01`",
      { parse_mode: "Markdown" }
    );
    return;
  }

  try {
    await ctx.reply(` Searching for: "${query}"...`);

    const userSnapshot = await db
      .collection("users")
      .where("telegramChatId", "==", chatId)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      await ctx.reply(" No account linked. Use /connect first.");
      return;
    }

    const userId = userSnapshot.docs[0].id;
    const integrationSnapshot = await db
      .collection("integrations")
      .where("userId", "==", userId)
      .where("provider", "==", "google")
      .limit(1)
      .get();

    if (integrationSnapshot.empty) {
      await ctx.reply(" Gmail not connected. Use /connect first.");
      return;
    }

    const integration = integrationSnapshot.docs[0].data();
    const gmail = await getGmailClient(
      integration.accessToken,
      integration.refreshToken
    );

    const emails = await searchEmails(gmail, query, 5);

    if (emails.length === 0) {
      await ctx.reply(` No emails found matching "${query}"`);
      return;
    }

    await ctx.reply(` Found ${emails.length} email(s):`);

    for (const email of emails) {
      await storeEmailContext(chatId, email.id, {
        subject: email.subject,
        from: email.from,
        body: email.snippet,
      });

      const message =
        ` *Email*\n\n` +
        `*From:* ${email.from}\n` +
        `*Subject:* ${email.subject}\n` +
        `*Date:* ${email.date}\n\n` +
        `_${email.snippet.substring(0, 150)}..._`;

      await ctx.reply(message, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: " Generate Reply", callback_data: `reply_${email.id}` },
              { text: " Full Summary", callback_data: `summary_${email.id}` },
            ],
          ],
        },
      });
    }
  } catch (error) {
    console.error("Search command error:", error);
    await ctx.reply(" Error searching emails. Please try again.");
  }
});

// Unlink command
bot.command("unlink", async (ctx: BotContext) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  await ctx.reply(
    " *Disconnect Gmail Account*\n\n" +
      "This will:\n" +
      " Stop all email notifications\n" +
      " Remove your Gmail connection\n" +
      " Delete stored email data\n\n" +
      "Are you sure?",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: " Yes, Disconnect", callback_data: "confirm_unlink" },
            { text: " Cancel", callback_data: "cancel_unlink" },
          ],
        ],
      },
    }
  );
});

bot.command("watch", async (ctx: BotContext) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  try {
    await ctx.reply(" Setting up real-time notifications...");

    const userSnapshot = await db
      .collection("users")
      .where("telegramChatId", "==", chatId)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      await ctx.reply(" No account linked. Use /connect first.");
      return;
    }

    const userId = userSnapshot.docs[0].id;
    const integrationSnapshot = await db
      .collection("integrations")
      .where("userId", "==", userId)
      .where("provider", "==", "google")
      .limit(1)
      .get();

    if (integrationSnapshot.empty) {
      await ctx.reply(" Gmail not connected. Use /connect first.");
      return;
    }

    const integrationDoc = integrationSnapshot.docs[0];
    const integration = integrationDoc.data();

    const gmail = await getGmailClient(
      integration.accessToken,
      integration.refreshToken
    );

    // Always refresh the watch (renews for 7 days)
    const watchData = await setupGmailWatch(gmail, "gmail-notifications");

    await integrationDoc.ref.update({
      gmailWatch: {
        active: true,
        historyId: watchData.historyId,
        expiration: watchData.expiration,
        updatedAt: new Date(),
      },
    });

    const expDate = new Date(parseInt(watchData.expiration));

    await ctx.reply(
      " *Real-time notifications enabled!*\n\n" +
        "You'll receive instant AI summaries when new emails arrive.\n\n" +
        ` Watch expires: ${expDate.toLocaleDateString()}\n` +
        "_Use /watch again to renew before expiry._\n\n" +
        "Use /unwatch to disable notifications.",
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Watch command error:", error);
    await ctx.reply(" Failed to enable notifications. Please try again.");
  }
});

bot.command("unwatch", async (ctx: BotContext) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  try {
    const userSnapshot = await db
      .collection("users")
      .where("telegramChatId", "==", chatId)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      await ctx.reply(" No account linked.");
      return;
    }

    const userId = userSnapshot.docs[0].id;
    const integrationSnapshot = await db
      .collection("integrations")
      .where("userId", "==", userId)
      .where("provider", "==", "google")
      .limit(1)
      .get();

    if (integrationSnapshot.empty) {
      await ctx.reply(" Gmail not connected.");
      return;
    }

    const integrationDoc = integrationSnapshot.docs[0];
    const integration = integrationDoc.data();

    if (!integration.gmailWatch?.active) {
      await ctx.reply("ℹ Push notifications are not enabled.");
      return;
    }

    const gmail = await getGmailClient(
      integration.accessToken,
      integration.refreshToken
    );

    await stopGmailWatch(gmail);

    await integrationDoc.ref.update({
      "gmailWatch.active": false,
      "gmailWatch.updatedAt": new Date(),
    });

    await ctx.reply(" Real-time notifications disabled. Use /watch to re-enable.");
  } catch (error) {
    console.error("Unwatch command error:", error);
    await ctx.reply(" Failed to disable notifications.");
  }
});

bot.command("help", async (ctx: BotContext) => {
  await ctx.reply(
    " *MailSync Commands*\n\n" +
      "*Getting Started:*\n" +
      "/start - Welcome message\n" +
      "/connect - Link your Gmail account\n" +
      "/unlink - Disconnect Gmail account\n\n" +
      "*Email Management:*\n" +
      "/check - Check recent unread emails\n" +
      "/search <keyword> - Search your emails\n\n" +
      "*Notifications:*\n" +
      "/watch - Enable real-time notifications\n" +
      "/unwatch - Disable notifications\n" +
      "/status - View account & notification status\n\n" +
      "/help - Show this message",
    { parse_mode: "Markdown" }
  );
});

// Callback query handler for inline buttons
bot.on("callback_query", async (ctx: BotContext) => {
  if (!ctx.callbackQuery || !("data" in ctx.callbackQuery)) return;
  
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const data = ctx.callbackQuery.data;

  if (data.startsWith("reply_")) {
    const emailId = data.replace("reply_", "");
    await ctx.answerCbQuery("Generating AI reply...");
    
    let emailContext = await getEmailContext(chatId, emailId);
    
    if (!emailContext) {
      try {
        const userSnapshot = await db
          .collection("users")
          .where("telegramChatId", "==", chatId)
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userId = userSnapshot.docs[0].id;
          const integrationSnapshot = await db
            .collection("integrations")
            .where("userId", "==", userId)
            .where("provider", "==", "google")
            .limit(1)
            .get();

          if (!integrationSnapshot.empty) {
            const integration = integrationSnapshot.docs[0].data();
            const gmail = await getGmailClient(
              integration.accessToken,
              integration.refreshToken
            );
            const email = await getEmailById(gmail, emailId);
            emailContext = {
              emailId: email.id,
              subject: email.subject,
              from: email.from,
              body: email.body || email.snippet,
            };
            await storeEmailContext(chatId, emailId, emailContext as any);
          }
        }
      } catch (error) {
        console.error("Error fetching email for reply:", error);
      }
    }

    if (!emailContext) {
      await ctx.reply(" Email not found. It may have been deleted.");
      return;
    }

    try {
      const replyText = await generateReply(
        emailContext.subject,
        emailContext.body,
        emailContext.from
      );

      await ctx.reply(
        ` *AI-Generated Reply:*\n\n${replyText}\n\n` +
          `To: ${emailContext.from}\n` +
          `Subject: Re: ${emailContext.subject}`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: " Send This Reply", callback_data: `send_${emailId}` },
                { text: " Regenerate", callback_data: `reply_${emailId}` },
              ],
              [{ text: " Cancel", callback_data: `cancel_${emailId}` }],
            ],
          },
        }
      );

      await storeEmailContext(chatId, emailId, {
        subject: emailContext.subject,
        from: emailContext.from,
        body: replyText,
      });
    } catch (error) {
      console.error("Reply generation error:", error);
      await ctx.reply(" Failed to generate reply. Please try again.");
    }
  } else if (data.startsWith("summary_")) {
    const emailId = data.replace("summary_", "");
    await ctx.answerCbQuery("Getting full summary...");

    try {
      const userSnapshot = await db
        .collection("users")
        .where("telegramChatId", "==", chatId)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        await ctx.reply(" User not found.");
        return;
      }

      const userId = userSnapshot.docs[0].id;
      const integrationSnapshot = await db
        .collection("integrations")
        .where("userId", "==", userId)
        .where("provider", "==", "google")
        .limit(1)
        .get();

      if (integrationSnapshot.empty) {
        await ctx.reply(" Gmail not connected.");
        return;
      }

      const integration = integrationSnapshot.docs[0].data();
      const gmail = await getGmailClient(
        integration.accessToken,
        integration.refreshToken
      );

      const email = await getEmailById(gmail, emailId);
      const summary = await summarizeEmail(email.subject, email.body, email.from);

      await storeEmailContext(chatId, emailId, {
        subject: email.subject,
        from: email.from,
        body: email.body || email.snippet,
      });

      await ctx.reply(
        ` *Full Email Summary*\n\n` +
          `*From:* ${email.from}\n` +
          `*Subject:* ${email.subject}\n\n` +
          `*AI Summary:*\n${summary}`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: " Generate Reply", callback_data: `reply_${emailId}` },
              ],
            ],
          },
        }
      );
    } catch (error) {
      console.error("Summary error:", error);
      await ctx.reply(" Failed to get summary.");
    }
  } else if (data.startsWith("send_")) {
    const emailId = data.replace("send_", "");
    await ctx.answerCbQuery("Sending email...");

    const emailContext = await getEmailContext(chatId, emailId);
    if (!emailContext) {
      await ctx.reply(" Reply context not found. Please generate a reply first.");
      return;
    }

    try {
      const userSnapshot = await db
        .collection("users")
        .where("telegramChatId", "==", chatId)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        await ctx.reply(" User not found.");
        return;
      }

      const userId = userSnapshot.docs[0].id;
      const integrationSnapshot = await db
        .collection("integrations")
        .where("userId", "==", userId)
        .where("provider", "==", "google")
        .limit(1)
        .get();

      if (integrationSnapshot.empty) {
        await ctx.reply(" Gmail not connected.");
        return;
      }

      const integration = integrationSnapshot.docs[0].data();
      const gmail = await getGmailClient(
        integration.accessToken,
        integration.refreshToken
      );

      const emailMatch = emailContext.from.match(/<(.+?)>/);
      const toEmail = emailMatch ? emailMatch[1] : emailContext.from;

      await sendEmail(
        gmail,
        toEmail,
        `Re: ${emailContext.subject}`,
        emailContext.body,
        emailId
      );

      await ctx.reply(" Reply sent successfully!");
      await deleteEmailContext(chatId, emailId);
    } catch (error) {
      console.error("Send email error:", error);
      await ctx.reply(" Failed to send reply. Please try again.");
    }
  } else if (data.startsWith("custom_")) {
    await ctx.answerCbQuery();
    await ctx.reply(
      " To send a custom reply, type your message below.\n\n" +
        "I'll send it as a reply to this email.\n\n" +
        "_Type /cancel to abort._",
      { parse_mode: "Markdown" }
    );
  } else if (data.startsWith("cancel_")) {
    const emailId = data.replace("cancel_", "");
    await ctx.answerCbQuery("Cancelled");
    await ctx.reply(" Action cancelled.");
    await deleteEmailContext(chatId, emailId);
  } else if (data === "confirm_unlink") {
    await ctx.answerCbQuery("Disconnecting...");

    try {
      const userSnapshot = await db
        .collection("users")
        .where("telegramChatId", "==", chatId)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        await ctx.reply(" No account to disconnect.");
        return;
      }

      const userId = userSnapshot.docs[0].id;

      // Stop Gmail watch if active
      const integrationSnapshot = await db
        .collection("integrations")
        .where("userId", "==", userId)
        .where("provider", "==", "google")
        .limit(1)
        .get();

      if (!integrationSnapshot.empty) {
        const integration = integrationSnapshot.docs[0].data();
        if (integration.gmailWatch?.active) {
          try {
            const gmail = await getGmailClient(
              integration.accessToken,
              integration.refreshToken
            );
            await stopGmailWatch(gmail);
          } catch (e) {
            console.log("Could not stop watch:", e);
          }
        }
        // Delete integration
        await integrationSnapshot.docs[0].ref.delete();
      }

      // Delete user
      await userSnapshot.docs[0].ref.delete();

      // Clean up email contexts
      const contextsSnapshot = await db
        .collection("emailContexts")
        .where("chatId", "==", chatId)
        .get();

      const batch = db.batch();
      contextsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      await ctx.reply(
        " *Account Disconnected*\n\n" +
          "Your Gmail has been unlinked and all data deleted.\n\n" +
          "Use /connect to link a new account.",
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      console.error("Unlink error:", error);
      await ctx.reply(" Failed to disconnect. Please try again.");
    }
  } else if (data === "cancel_unlink") {
    await ctx.answerCbQuery("Cancelled");
    await ctx.reply(" Account disconnect cancelled.");
  }
});

// Export helper function for use in index.ts (Pub/Sub handler)
export { storeEmailContext };
