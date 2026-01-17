import { google, gmail_v1 } from 'googleapis';
import { config } from '../config/env';

export async function getGmailClient(
  accessToken: string,
  refreshToken: string
): Promise<gmail_v1.Gmail> {
  const oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function fetchRecentEmails(
  gmail: gmail_v1.Gmail,
  maxResults: number = 10
): Promise<any[]> {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: 'is:unread',
    });

    const messages = response.data.messages || [];
    const emails = [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full',
      });

      const headers = email.data.payload?.headers || [];
      const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find((h) => h.name === 'From')?.value || 'Unknown';

      let body = email.data.snippet || '';
      
      if (email.data.payload?.parts) {
        const textPart = email.data.payload.parts.find(
          (part) => part.mimeType === 'text/plain'
        );
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      }

      emails.push({
        id: email.data.id!,
        threadId: email.data.threadId!,
        subject,
        from,
        body,
        snippet: email.data.snippet || '',
        labels: email.data.labelIds || [],
      });
    }

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw new Error('Failed to fetch emails');
  }
}

export async function searchEmails(
  gmail: gmail_v1.Gmail,
  query: string,
  maxResults: number = 5
): Promise<any[]> {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: query,
    });

    const messages = response.data.messages || [];
    const emails = [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full',
      });

      const headers = email.data.payload?.headers || [];
      const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find((h) => h.name === 'From')?.value || 'Unknown';
      const date = headers.find((h) => h.name === 'Date')?.value || '';

      emails.push({
        id: email.data.id!,
        threadId: email.data.threadId!,
        subject,
        from,
        date,
        snippet: email.data.snippet || '',
      });
    }

    return emails;
  } catch (error) {
    console.error('Error searching emails:', error);
    throw new Error('Failed to search emails');
  }
}

export async function getEmailById(
  gmail: gmail_v1.Gmail,
  emailId: string
): Promise<any> {
  try {
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full',
    });

    const headers = email.data.payload?.headers || [];
    const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
    const from = headers.find((h) => h.name === 'From')?.value || 'Unknown';

    let body = email.data.snippet || '';
    
    if (email.data.payload?.parts) {
      const textPart = email.data.payload.parts.find(
        (part) => part.mimeType === 'text/plain'
      );
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    }

    return {
      id: email.data.id!,
      threadId: email.data.threadId!,
      subject,
      from,
      body,
      snippet: email.data.snippet || '',
      labels: email.data.labelIds || [],
    };
  } catch (error) {
    console.error('Error fetching email by ID:', error);
    throw new Error('Failed to fetch email');
  }
}

export async function sendEmail(
  gmail: gmail_v1.Gmail,
  to: string,
  subject: string,
  body: string,
  threadId?: string
): Promise<void> {
  try {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      threadId ? `In-Reply-To: ${threadId}` : '',
      threadId ? `References: ${threadId}` : '',
      '',
      body,
    ]
      .filter(Boolean)
      .join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId: threadId,
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function setupGmailWatch(
  gmail: gmail_v1.Gmail,
  topicName: string
): Promise<{ historyId: string; expiration: string }> {
  try {
    const response = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: `projects/atscv-673b8/topics/${topicName}`,
        labelIds: ['INBOX'],
      },
    });

    return {
      historyId: response.data.historyId!,
      expiration: response.data.expiration!,
    };
  } catch (error) {
    console.error('Error setting up Gmail watch:', error);
    throw new Error('Failed to setup Gmail watch');
  }
}

export async function stopGmailWatch(gmail: gmail_v1.Gmail): Promise<void> {
  try {
    await gmail.users.stop({
      userId: 'me',
    });
  } catch (error) {
    console.error('Error stopping Gmail watch:', error);
    throw new Error('Failed to stop Gmail watch');
  }
}

export async function getHistoryChanges(
  gmail: gmail_v1.Gmail,
  startHistoryId: string
): Promise<string[]> {
  try {
    const response = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: startHistoryId,
      historyTypes: ['messageAdded'],
    });

    const history = response.data.history || [];
    const messageIds: string[] = [];

    for (const record of history) {
      if (record.messagesAdded) {
        for (const added of record.messagesAdded) {
          if (added.message?.id) {
            messageIds.push(added.message.id);
          }
        }
      }
    }

    return messageIds;
  } catch (error) {
    console.error('Error getting history changes:', error);
    return [];
  }
}