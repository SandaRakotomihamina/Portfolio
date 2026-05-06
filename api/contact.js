import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }

  // Configuration du transporteur SMTP (exemple avec Gmail)
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Variable d'environnement
      pass: process.env.GMAIL_PASS, // Mot de passe d'application
    },
  });

  const mailOptions = {
    from: email,
    to: 'rakotomihaminasandafitia@gmail.com',
    subject: subject,
    text: `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: 'OK' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
}