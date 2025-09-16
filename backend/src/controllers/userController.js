import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getUsers = async (req, res) => {
  try {
    const { search = '', role } = req.query;
    const query = {
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { position: new RegExp(search, 'i') }
      ]
    };

    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password');
    return successResponse(res, users);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    return successResponse(res, user);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, position, email, role = 'Utilisateur', password } = req.body;
    if (!name || !email || !password) {
      return errorResponse(res, 'Nom, email et mot de passe requis');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return errorResponse(res, 'Email déjà utilisé', 409);
    }

    const user = await User.create({ name, position, email, role, password });
    return successResponse(res, { ...user.toObject(), password: undefined }, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return errorResponse(res, 'Utilisateur introuvable', 404);
      }
      user.set(updates);
      await user.save();
      user.password = undefined;
      return successResponse(res, user);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    return successResponse(res, user);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    return successResponse(res, { id: user._id });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
