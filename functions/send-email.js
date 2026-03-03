      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      async function sendEmail(to, from, subject, text, html) {
        const msg = {
          to,
          from,
          subject,
          text,
          html,
        };

        try {
          await sgMail.send(msg);
          console.log('Email sent successfully');
          return { success: true };
        } catch (error) {
          console.error('Error sending email:', error);
          if (error.response) {
            console.error(error.response.body);
          }
          return { success: false, error };
        }
      }

      module.exports = { sendEmail };
