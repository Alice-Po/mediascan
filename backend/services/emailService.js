import nodemailer from 'nodemailer';
import config from '../config/env.js';

// Créer un compte de test Ethereal
const createTestAccount = async () => {
  console.log('=== Création du compte Ethereal ===');
  const testAccount = await nodemailer.createTestAccount();
  console.log('Compte Ethereal créé:', {
    user: testAccount.user,
    pass: testAccount.pass,
    smtp: testAccount.smtp,
  });
  return testAccount;
};

// Créer le transporteur
const createTransporter = async () => {
  console.log('=== Configuration du transporteur email ===');
  console.log('Environnement:', process.env.NODE_ENV);

  // En développement, utiliser Ethereal
  if (process.env.NODE_ENV !== 'production') {
    console.log('Mode développement: utilisation de Ethereal');
    const testAccount = await createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Transporteur Ethereal configuré');
    return transporter;
  }

  // En production, utiliser la configuration réelle
  console.log('Mode production: utilisation de Gmail');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
  console.log('Transporteur Gmail configuré');
  return transporter;
};

let transporter;

// Initialiser le transporteur
const initializeTransporter = async () => {
  if (!transporter) {
    console.log('Initialisation du transporteur email...');
    transporter = await createTransporter();
  }
  return transporter;
};

export const sendVerificationEmail = async (email, token) => {
  try {
    console.log('=== Envoi email de vérification ===');
    console.log('Destinataire:', email);

    const transport = await initializeTransporter();
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;
    console.log('URL de vérification:', verificationUrl);

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

    console.log("Envoi de l'email...");
    const info = await transport.sendMail(mailOptions);
    console.log('Email envoyé avec succès');

    // Afficher l'URL de prévisualisation Ethereal en développement uniquement
    if (process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('=== Informations Ethereal ===');
      console.log('URL de prévisualisation:', previewUrl);
      console.log('Message ID:', info.messageId);
      console.log('===========================');
    }

    return info;
  } catch (error) {
    console.error('=== Erreur envoi email ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    throw new Error("Erreur lors de l'envoi de l'email de vérification");
  }
};
