import mjml2html from "mjml";
import handlebars from 'handlebars';

const actionRequiredEmailTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" font-weight="bold">{{subject}}</mj-text>
        <mj-text>Hello {{username}},</mj-text>
        <mj-text>{{message}}</mj-text>

        {{#if otp}}
        <mj-text font-size="22px" color="#4CAF50" font-weight="bold">{{otp}}</mj-text>
        {{/if}}

        {{#if actionButtonUrl}}
        <mj-button href="{{actionButtonUrl}}" background-color="#4CAF50">{{actionButtonText}}</mj-button>
        {{/if}}

        <mj-text>If you didn’t request this, you can safely ignore this email.</mj-text>
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
    otp: string,
}

export const actionRequiredEmailHTML = ({username, subject, message, otp, actionButtonUrl}: Props) => {
  // compile template string with variables
  const compiledTemplate = handlebars.compile(actionRequiredEmailTemplate);
  
  const mjmlWithData = compiledTemplate({username, subject, message, otp, actionButtonUrl});
  
  // convert MJML to final HTML
  const { html } = mjml2html(mjmlWithData);
  return html;
}