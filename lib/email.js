import sgmail from '@sendgrid/mail';
sgmail.setApiKey(process.env.SENDGRID_API_KEY);
import { readFileSync } from 'fs';
import { render } from 'ejs';

const TemplatesProvider = (templateName, params) => {
  const templates = {
    'Emails.VerifyEmail': {
      subject: 'Verify your email',
      text: 'Verify your email',
      html: render(readFileSync('./VerifyEmail.ejs', 'utf8'), {
        FRIENDLY_NAME: process.env.FRIENDLY_NAME,
        verify_url: params.verify_url,
      }),
    },
  };
  return templates[templateName];
};

// console.log(TemplatesProvider('Emails.VerifyEmail', { verify_url: 'test' }));

const Email = {
  send: async ({ to, templateName, params }) => {
    // const template = TemplatesProvider(templateName, params);
    // const msg = {
    //   to,
    //   from: process.env.EMAIL_FROM,
    //   subject: template.subject,
    //   text: template.text,
    //   html: template.html,
    // };
    // await sgmail.send(msg);
  },
};

export { Email };
