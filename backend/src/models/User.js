import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const skillLevelEnum = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: String, enum: skillLevelEnum, default: 'Débutant' }
  },
  { _id: true }
);

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    provider: { type: String, trim: true },
    status: { type: String, enum: ['En cours', 'Terminé', 'Planifié'], default: 'Planifié' },
    completionDate: { type: Date },
    notes: { type: String, trim: true }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ['Admin', 'Utilisateur'], default: 'Utilisateur' },
    password: { type: String, required: true, select: false },
    skills: [skillSchema],
    trainings: [trainingSchema]
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
