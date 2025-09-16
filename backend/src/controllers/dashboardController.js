import PDFDocument from 'pdfkit';
import moment from 'moment';
moment.locale('fr');
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

const levelScores = {
  Débutant: 1,
  Intermédiaire: 2,
  Avancé: 3,
  Expert: 4
};

const trainingStatuses = ['Planifié', 'En cours', 'Terminé'];

const computeSkillAverage = (skills = []) => {
  if (!skills.length) return 0;
  const total = skills.reduce((acc, skill) => acc + (levelScores[skill.level] || 0), 0);
  return Math.round((total / skills.length) * 100) / 100;
};

export const getMetrics = async (req, res) => {
  try {
    const users = await User.find();
    const totalUsers = users.length;
    const skillsByUser = users.map((user) => ({
      userId: user._id,
      name: user.name,
      averageSkill: computeSkillAverage(user.skills)
    }));
    const globalSkillAverage =
      skillsByUser.reduce((acc, user) => acc + user.averageSkill, 0) / (skillsByUser.length || 1);

    const trainings = users.flatMap((user) => user.trainings);
    const completedTrainings = trainings.filter((training) => training.status === 'Terminé');
    const trainingCompletionRate = trainings.length
      ? Math.round((completedTrainings.length / trainings.length) * 100)
      : 0;

    const statusDistribution = trainingStatuses.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    trainings.forEach((training) => {
      statusDistribution[training.status] = (statusDistribution[training.status] || 0) + 1;
    });

    return successResponse(res, {
      totalUsers,
      globalSkillAverage: Math.round(globalSkillAverage * 100) / 100,
      skillsByUser,
      trainingCompletionRate,
      statusDistribution
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const exportReport = async (req, res) => {
  try {
    const users = await User.find();
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="skillboard-report.pdf"');

    doc.pipe(res);

    doc.fontSize(20).text('Rapport SkillBoard', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${moment().format('DD/MM/YYYY HH:mm')}`);
    doc.moveDown();

    users.forEach((user) => {
      doc.fontSize(16).text(user.name);
      doc.fontSize(12).text(`Poste: ${user.position || 'Non spécifié'}`);
      doc.text(`Rôle: ${user.role}`);
      doc.moveDown(0.5);

      doc.fontSize(14).text('Compétences');
      if (user.skills.length === 0) {
        doc.fontSize(12).text('Aucune compétence enregistrée');
      } else {
        user.skills.forEach((skill) => {
          doc.fontSize(12).text(`- ${skill.name} (${skill.level})`);
        });
      }
      doc.moveDown(0.5);

      doc.fontSize(14).text('Formations');
      if (user.trainings.length === 0) {
        doc.fontSize(12).text('Aucune formation enregistrée');
      } else {
        user.trainings.forEach((training) => {
          doc.fontSize(12).text(
            `- ${training.title} | ${training.status} | ${training.completionDate ? moment(training.completionDate).format('DD/MM/YYYY') : 'Date à venir'}`
          );
        });
      }
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
