import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend | null = null;
  private readonly fromAddress: string;
  private readonly frontendUrl: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY not set — emails will be logged only');
    }
    this.fromAddress = this.config.get<string>('EMAIL_FROM') ?? 'Modulas <noreply@modulas.com>';
    this.frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
  }

  async sendPasswordReset(email: string, name: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
    const subject  = 'Reset your Modulas password';
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1a1a1a">Password Reset Request</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>We received a request to reset your password. Click the button below — this link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#b8960c;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#666;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">Modulas — Luxury Furniture</p>
      </div>`;

    await this.send({ to: email, subject, html });
  }

  async sendApprovalNotification(email: string, name: string, role: string): Promise<void> {
    const subject = 'Your Modulas account has been approved';
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1a1a1a">Account Approved</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Great news — your <strong>${escapeHtml(role)}</strong> account on Modulas has been approved. You now have full access.</p>
        <a href="${this.frontendUrl}/login" style="display:inline-block;padding:12px 24px;background:#b8960c;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0">
          Sign In
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">Modulas — Luxury Furniture</p>
      </div>`;

    await this.send({ to: email, subject, html });
  }

  private async send(opts: { to: string; subject: string; html: string }): Promise<void> {
    if (!this.resend) {
      this.logger.debug(`[email skipped — no API key] to=${opts.to} subject="${opts.subject}"`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromAddress,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      });
    } catch (err) {
      // Log but never throw — email failure must not break auth flows
      this.logger.error(`Failed to send email to ${opts.to}: ${(err as Error).message}`);
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
