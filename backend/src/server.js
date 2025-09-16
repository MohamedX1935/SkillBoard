import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const ensureAdminUser = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('ADMIN_EMAIL ou ADMIN_PASSWORD non défini. Aucun administrateur créé.');
    return;
  }
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    await User.create({
      name: 'Administrateur',
      email: ADMIN_EMAIL,
      position: 'RH',
      role: 'Admin',
      password: ADMIN_PASSWORD
    });
    console.log('Compte administrateur créé');
  }
};

const start = async () => {
  await connectDB(process.env.MONGODB_URI);
  await ensureAdminUser();
  server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
};

start().catch((error) => {
  console.error('Erreur au démarrage du serveur:', error);
  process.exit(1);
});
