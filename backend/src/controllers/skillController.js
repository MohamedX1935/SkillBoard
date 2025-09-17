import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getSkills = async (req, res) => {
  try {
    const { userId } = req.query;
    let users;
    if (userId) {
      users = await User.findById(userId).select('name skills').lean();
      if (!users) {
        return errorResponse(res, 'Utilisateur introuvable', 404);
      }
      return successResponse(res, users);
    }

    users = await User.find().select('name position skills').lean();
    return successResponse(res, users);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const addSkill = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, level = 'Débutant' } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    user.skills.push({ name, level });
    await user.save();
    return successResponse(res, user.skills[user.skills.length - 1], 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { userId, skillId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    const skill = user.skills.id(skillId);
    if (!skill) {
      return errorResponse(res, 'Compétence introuvable', 404);
    }
    skill.set(req.body);
    await user.save();
    return successResponse(res, skill);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { userId, skillId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    const skill = user.skills.id(skillId);
    if (!skill) {
      return errorResponse(res, 'Compétence introuvable', 404);
    }
    skill.deleteOne();
    await user.save();
    return successResponse(res, { id: skillId });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
