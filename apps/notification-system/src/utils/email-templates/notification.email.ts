import mjml2html from "mjml";
import handlebars from 'handlebars';
import fs from 'fs';

const notifiationEmailTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" font-weight="bold">{{subject}}</mj-text>
        <mj-text>Hello {{username}},</mj-text>
        <mj-text>{{message}}</mj-text>

        {{#if actionButtonUrl}}
        <mj-button href="{{actionButtonUrl}}" background-color="#4CAF50">{{actionButtonText}}</mj-button>
        {{/if}}

        <mj-text>If you have any questions or concerns, feel free to contact our support team.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>

`

type Props = {
    subject: string,
    message: string,
    username: string,
    actionButtonUrl: string,
}

export const notificationEmailHTML = ({username, subject, message, actionButtonUrl}: Props) => {
  // compile template string with variables
  const compiledTemplate = handlebars.compile(notifiationEmailTemplate);
  
  const mjmlWithData = compiledTemplate({username, subject, message, actionButtonUrl});
  
  // convert MJML to final HTML
  const { html } = mjml2html(mjmlWithData);
  return html;
}


