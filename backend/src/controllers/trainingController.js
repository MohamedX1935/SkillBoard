import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getTrainings = async (req, res) => {
  try {
    const { userId, status } = req.query;
    if (userId) {
      const user = await User.findById(userId).select('name trainings').lean();
      if (!user) {
        return errorResponse(res, 'Utilisateur introuvable', 404);
      }
      let trainings = user.trainings;
      if (status) {
        trainings = trainings.filter((training) => training.status === status);
      }
      return successResponse(res, { user: user.name, trainings });
    }

    const users = await User.find().select('name trainings').lean();
    const trainings = users.flatMap((user) =>
      user.trainings.map((training) => {
        const trainingObj = typeof training.toObject === 'function' ? training.toObject() : training;
        return { ...trainingObj, user: user.name, userId: user._id };
      })
    );
    const filtered = status ? trainings.filter((training) => training.status === status) : trainings;
    return successResponse(res, filtered);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const addTraining = async (req, res) => {
  try {
    const { userId } = req.params;
    const trainingData = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    user.trainings.push(trainingData);
    await user.save();
    return successResponse(res, user.trainings[user.trainings.length - 1], 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateTraining = async (req, res) => {
  try {
    const { userId, trainingId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    const training = user.trainings.id(trainingId);
    if (!training) {
      return errorResponse(res, 'Formation introuvable', 404);
    }
    training.set(req.body);
    await user.save();
    return successResponse(res, training);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteTraining = async (req, res) => {
  try {
    const { userId, trainingId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }
    const training = user.trainings.id(trainingId);
    if (!training) {
      return errorResponse(res, 'Formation introuvable', 404);
    }
    training.deleteOne();
    await user.save();
    return successResponse(res, { id: trainingId });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
