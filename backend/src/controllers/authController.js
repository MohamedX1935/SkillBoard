import User from '../models/User.js';
import { generateToken } from '../utils/token.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const { name, position, email, role = 'Utilisateur', password } = req.body;
    if (!name || !email || !password) {
      return errorResponse(res, 'Nom, email et mot de passe sont requis');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return errorResponse(res, 'Un utilisateur existe déjà avec cet email', 409);
    }

    const user = await User.create({ name, position, email, role, password });
    const token = generateToken(user);
    return successResponse(res, { token, user: { ...user.toObject(), password: undefined } }, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 'Email et mot de passe requis');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Identifiants invalides', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Identifiants invalides', 401);
    }

    const token = generateToken(user);
    user.password = undefined;
    return successResponse(res, { token, user });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
