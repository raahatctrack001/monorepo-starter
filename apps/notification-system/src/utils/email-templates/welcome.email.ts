import mjml2html from 'mjml';
import handlebars from 'handlebars';

// MJML template as a string
const welcomeEmailTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" font-weight="bold">Welcome to Social Desk, {{username}}!</mj-text>
        <mj-text>We’re thrilled to have you onboard. Start connecting with your friends and sharing your moments today!</mj-text>
        {{#if verifyLink}}
        <mj-button href="{{verifyLink}}" background-color="#4CAF50">Verify Your Email</mj-button>
        {{/if}}
        <mj-text>If you didn’t sign up for Social Desk, you can safely ignore this email.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`



export const welcomeEmailHTML = ({username, verifyLink}: { username: string, verifyLink: string}) => {
  // compile template string with variables
  const compiledTemplate = handlebars.compile(welcomeEmailTemplate);
  
  const mjmlWithData = compiledTemplate({
    username,
    verifyLink
  });
  
  // convert MJML to final HTML
  const { html } = mjml2html(mjmlWithData);
  return html;
}

