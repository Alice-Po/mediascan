import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/emailService.js';

// Mock de la fonction d'envoi d'email
vi.mock('../services/emailService.js', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(true),
}));

// Configuration du serveur MongoDB en mémoire
let mongoServer;

// Vérifier que MongoDB n'est pas déjà connecté
const checkMongoConnection = async () => {
  if (mongoose.connection.readyState !== 0) {
    console.log('Fermeture de la connexion MongoDB existante...');
    await mongoose.disconnect();
  }
};

// Configuration avant tous les tests
beforeAll(async () => {
  // Vérifier et fermer toute connexion MongoDB existante
  await checkMongoConnection();

  // Démarrer le serveur MongoDB en mémoire
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connecter à la base de données de test
  await mongoose.connect(mongoUri);
});

// Nettoyage après chaque test
afterEach(async () => {
  await User.deleteMany({});
  vi.clearAllMocks();
});

// Nettoyage après tous les tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Système d'authentification", () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  describe('Inscription', () => {
    it('devrait créer un nouvel utilisateur avec succès', async () => {
      const response = await request(app).post('/api/auth/register').send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Inscription réussie');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(sendVerificationEmail).toHaveBeenCalledWith(testUser.email, expect.any(String));
    });

    it("ne devrait pas permettre l'inscription avec un email déjà utilisé", async () => {
      // Créer d'abord un utilisateur
      await User.create(testUser);

      // Tenter de créer un autre utilisateur avec le même email
      const response = await request(app).post('/api/auth/register').send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('déjà utilisé');
    });
  });

  describe("Vérification d'email", () => {
    it("devrait vérifier l'email avec un token valide", async () => {
      // Créer un utilisateur avec un token de vérification
      const user = await User.create({
        ...testUser,
        verificationToken: 'valid-token',
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const response = await request(app).get(`/api/auth/verify-email/${user.verificationToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('vérifié avec succès');

      // Vérifier que l'utilisateur est marqué comme vérifié
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.isVerified).toBe(true);
    });

    it("ne devrait pas vérifier l'email avec un token expiré", async () => {
      // Créer un utilisateur avec un token expiré
      const user = await User.create({
        ...testUser,
        verificationToken: 'expired-token',
        verificationTokenExpires: new Date(Date.now() - 24 * 60 * 60 * 1000),
      });

      const response = await request(app).get(`/api/auth/verify-email/${user.verificationToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('invalide ou a expiré');
    });
  });

  describe('Connexion', () => {
    beforeEach(async () => {
      // Créer un utilisateur vérifié
      await User.create({
        ...testUser,
        isVerified: true,
      });
    });

    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('ne devrait pas connecter un utilisateur non vérifié', async () => {
      // Créer un utilisateur non vérifié
      await User.create({
        ...testUser,
        email: 'unverified@example.com',
        isVerified: false,
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'unverified@example.com',
        password: testUser.password,
      });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('vérifier votre email');
    });

    it('ne devrait pas connecter avec des identifiants invalides', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('incorrect');
    });
  });
});
