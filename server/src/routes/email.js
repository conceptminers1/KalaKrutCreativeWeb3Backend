      import express from 'express';
      import { sendEmail } from '../../../functions/send-email.js';

      const router = express.Router();

      router.post('/send-email', async (req, res) => {
        const { to, from, subject, text, html } = req.body;

        if (!to || !from || !subject || !text) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const result = await sendEmail(to, from, subject, text, html);

        if (result.success) {
          res.status(200).json({ message: 'Email sent successfully' });
        } else {
          res.status(500).json({ message: 'Failed to send email' });
        }
      });

      export default router;
