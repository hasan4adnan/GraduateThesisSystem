# GTS Backend API

Node.js + Express + TypeScript backend for the Graduate Thesis System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the backend directory with:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=gts

PORT=3007
NODE_ENV=development
```

**Note:** Never commit your `.env` file to version control. See `.env.example` for a template.

3. Make sure MySQL is running and the `gts` database exists with all required tables.

## Running

Development mode (with auto-reload):
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Universities
- `GET /api/universities` - Get all universities
- `GET /api/universities/:id` - Get university by ID
- `POST /api/universities` - Create university
- `PUT /api/universities/:id` - Update university
- `DELETE /api/universities/:id` - Delete university

### Institutes
- `GET /api/institutes` - Get all institutes
- `GET /api/institutes/:id` - Get institute by ID
- `GET /api/institutes/university/:universityId` - Get institutes by university
- `POST /api/institutes` - Create institute
- `PUT /api/institutes/:id` - Update institute
- `DELETE /api/institutes/:id` - Delete institute

### People
- `GET /api/people` - Get all people
- `GET /api/people/:id` - Get person by ID
- `POST /api/people` - Create person
- `PUT /api/people/:id` - Update person
- `DELETE /api/people/:id` - Delete person

### Subject Topics
- `GET /api/subject-topics` - Get all subject topics
- `GET /api/subject-topics/:id` - Get subject topic by ID
- `POST /api/subject-topics` - Create subject topic
- `PUT /api/subject-topics/:id` - Update subject topic
- `DELETE /api/subject-topics/:id` - Delete subject topic

### Theses
- `GET /api/theses` - Get all theses
- `GET /api/theses/:id` - Get thesis by ID (includes supervisors, topics, keywords)
- `GET /api/theses/search?query=...&author_id=...&university_id=...` - Search theses
- `POST /api/theses` - Create thesis
- `PUT /api/theses/:id` - Update thesis
- `DELETE /api/theses/:id` - Delete thesis

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Health Check
- `GET /api/health` - Check API status

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic / database operations
│   ├── validators/      # Zod validation schemas
│   └── index.ts         # Entry point
├── dist/                # Compiled JavaScript (generated)
└── package.json
```

## Technologies

- **Express** - Web framework
- **TypeScript** - Type safety
- **MySQL2** - Database driver
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables





