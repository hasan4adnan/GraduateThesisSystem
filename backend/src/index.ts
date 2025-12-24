import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import universityRoutes from './routes/university.routes';
import instituteRoutes from './routes/institute.routes';
import personRoutes from './routes/person.routes';
import subjectTopicRoutes from './routes/subjectTopic.routes';
import thesisRoutes from './routes/thesis.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/universities', universityRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/people', personRoutes);
app.use('/api/subject-topics', subjectTopicRoutes);
app.use('/api/theses', thesisRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GTS Backend API is running' });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
});





