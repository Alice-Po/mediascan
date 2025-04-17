import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log('=== Vérification Email Frontend ===');
        console.log('Token à vérifier:', token);

        const response = await api.get(`/auth/verify-email/${token}`);
        console.log('Réponse vérification:', response.data);

        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        console.error('Erreur vérification:', {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Vérification de l'email</h1>

        {status === 'verifying' && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Vérification de votre email en cours...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 text-green-600">
            <p>Email vérifié avec succès !</p>
            <p className="mt-2 text-gray-600">Redirection vers la page de connexion...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 text-red-600">
            <p>Le lien de vérification est invalide ou a expiré.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
