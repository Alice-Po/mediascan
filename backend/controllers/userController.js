import User from '../models/User.js';

/**
 * @desc    Récupérer le profil d'un utilisateur
 * @route   GET /api/users/:userId/profile
 * @access  Public
 */
export const getUserProfile = async (req, res) => {
  try {
    console.log('📍 Tentative de récupération du profil utilisateur:', req.params.userId);

    const user = await User.findById(req.params.userId).select('-password').lean();

    if (!user) {
      console.log('❌ Utilisateur non trouvé:', req.params.userId);
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    console.log('✅ Profil utilisateur trouvé:', user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil utilisateur',
      error: error.message,
    });
  }
};
