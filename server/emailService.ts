import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set. Email functionality will be disabled.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("Email not sent: SENDGRID_API_KEY not configured");
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from || (process.env.FROM_EMAIL || 'noreply@yadnusconsultant.com'),
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendContactNotification(data: any): Promise<boolean> {
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <p><strong>Project Type:</strong> ${data.projectType || 'Not specified'}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `;

  return await sendEmail({
    to: (process.env.ADMIN_EMAIL || 'admin@yadnusconsultant.com'),
    from: (process.env.FROM_EMAIL || 'noreply@yadnusconsultant.com'),
    subject: 'New Contact Form Submission - Yadnus Consultant',
    html,
  });
}

export async function sendWebinarConfirmation(data: any, webinarTitle: string): Promise<boolean> {
  const html = `
    <h2>Webinar Registration Confirmation</h2>
    <p>Dear ${data.name},</p>
    <p>Thank you for registering for our webinar: <strong>${webinarTitle}</strong></p>
    <p>You will receive joining instructions closer to the event date.</p>
    <p>Best regards,<br>Yadnus Consultant Team</p>
  `;

  return await sendEmail({
    to: data.email,
    from: process.env.FROM_EMAIL || 'noreply@yadnusconsultant.com',
    subject: `Webinar Registration Confirmed - ${webinarTitle}`,
    html,
  });
}

export async function sendProjectInquiryNotification(data: any): Promise<boolean> {
  const html = `
    <h2>New Project Inquiry</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Budget Range:</strong> ${data.budgetRange || 'Not specified'}</p>
    <p><strong>Description:</strong></p>
    <p>${data.description}</p>
  `;

  return await sendEmail({
    to: (process.env.ADMIN_EMAIL || 'admin@yadnusconsultant.com'),
    from: (process.env.FROM_EMAIL || 'noreply@yadnusconsultant.com'),
    subject: 'New Project Inquiry - Yadnus Consultant',
    html,
  });
}

export async function sendNewsletterWelcome(email: string): Promise<boolean> {
  const html = `
    <h2>Welcome to Yadnus Consultant Newsletter</h2>
    <p>Thank you for subscribing to our newsletter! You'll receive the latest insights on town planning, construction management, and sustainable development.</p>
    <p>Best regards,<br>Yadnus Consultant Team</p>
  `;

  return await sendEmail({
    to: email,
    from: process.env.FROM_EMAIL || 'noreply@yadnusconsultant.com',
    subject: 'Welcome to Yadnus Consultant Newsletter',
    html,
  });
}
