import nodemailer from 'nodemailer';
import config from '../config/env.js';

// Créer un compte de test Ethereal
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return testAccount;
};

// Créer le transporteur
const createTransporter = async () => {
  // En développement, utiliser Ethereal
  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // En production, utiliser la configuration réelle
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
};

let transporter;

// Initialiser le transporteur
const initializeTransporter = async () => {
  if (!transporter) {
    transporter = await createTransporter();
  }
  return transporter;
};

export const sendVerificationEmail = async (email, token) => {
  try {
    const transport = await initializeTransporter();
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;

    const mailOptions = {
      from: '"MédiaScan" <no-reply@mediascan.com>',
      to: email,
      subject: 'Vérifiez votre compte MédiaScan',
      html: `
        <h1>Bienvenue sur MédiaScan !</h1>
        <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${verificationUrl}">Vérifier mon compte</a>
        <p>Ce lien est valable 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
      `,
    };

    const info = await transport.sendMail(mailOptions);

    // Afficher l'URL de prévisualisation Ethereal en développement uniquement
    if (process.env.NODE_ENV !== 'production') {
      console.log('URL de prévisualisation:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    throw new Error("Erreur lors de l'envoi de l'email de vérification");
  }
};
