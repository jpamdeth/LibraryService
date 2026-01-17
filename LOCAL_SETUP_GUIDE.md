# 🚀 Running LibraryService Locally - Complete Guide

## Prerequisites ✅ (Already Installed)
- ✅ Node.js v24.7.0
- ✅ npm v11.5.2  
- ✅ All dependencies installed

## Option 1: 🐳 Docker (Recommended - Easiest)

### Requirements
- Docker Desktop installed and running

### Steps
```powershell
# Start the entire stack (API + MySQL database)
docker compose up

# Or run in background
docker compose up -d
```

**That's it!** The service will be available at:
- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Swagger Docs**: http://localhost:3000/api

Docker will automatically:
- Start MySQL database with the correct schema
- Run database migrations
- Start the NestJS API server

---

## Option 2: 🔧 Local Development Setup

### Requirements
- MySQL 8.0+ installed locally
- Database named `library` created

### Step 1: Database Setup

#### Option A: Install MySQL locally
1. Download MySQL 8.0+ from https://dev.mysql.com/downloads/mysql/
2. Install and start MySQL service
3. Create database:
   ```sql
   CREATE DATABASE library;
   ```

#### Option B: Use Docker for MySQL only
```powershell
# Run just the MySQL container
docker run -d \
  --name library-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootTopsecret \
  -e MYSQL_DATABASE=library \
  mysql:8
```

### Step 2: Environment Configuration

The `.env` file should already exist. Verify it contains:
```env
DATABASE_URL="mysql://root:rootTopsecret@localhost:3306/library"
NODE_ENV="development"
PORT="3000"
```

**Note**: Adjust the DATABASE_URL if you have different MySQL credentials.

### Step 3: Database Migration & Start

```powershell
# Generate Prisma client and run migrations, then start
npm run startup

# OR run steps individually:
npm run prisma:generate
npm run migrate:deploy
npm run start:dev
```

---

## 🧪 Testing Your Setup

### 1. Health Check
```powershell
curl http://localhost:3000/health
# Should return: "up and running!"
```

### 2. API Documentation
Visit: http://localhost:3000/api

### 3. Test Endpoints
```powershell
# Create an author
curl -X POST http://localhost:3000/library/authors \
  -H "Content-Type: application/json" \
  -d '{"firstName": "J.R.R.", "lastName": "Tolkien"}'

# Get all authors
curl http://localhost:3000/library/authors
```

### 4. Run Tests
```powershell
npm test           # Unit tests
npm run test:e2e   # End-to-end tests
npm run test:cov   # With coverage
```

---

## 🛠️ Development Commands

```powershell
# Development (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Database management
npm run prisma:studio      # Visual database browser
npm run migrate:dev        # Create new migration
npm run prisma:generate    # Regenerate Prisma client
```

---

## 🔍 Troubleshooting

### Issue: "Can't connect to database"
**Solution**: 
1. Ensure MySQL is running
2. Check DATABASE_URL in `.env`
3. Verify database `library` exists

### Issue: "Prisma client not generated"
**Solution**:
```powershell
npm run prisma:generate
```

### Issue: "Migration failed" 
**Solution**:
```powershell
npm run migrate:dev
```

### Issue: "Port 3000 already in use"
**Solution**: 
1. Kill process using port 3000
2. Or change PORT in `.env` file

---

## 🌟 What You Get

- **REST API** for managing books, authors, and genres
- **Rate limiting** (100 requests/minute)
- **Input validation** on all endpoints
- **Error handling** with structured responses
- **Swagger documentation** at `/api`
- **Health monitoring** at `/health`
- **AI integration** for book recommendations (requires OpenAI API key)

---

## 🚀 Quick Start (TL;DR)

**Easiest way:**
```powershell
docker compose up
```
Then visit http://localhost:3000/api

**Development way:**
```powershell
# Ensure MySQL is running locally, then:
npm run startup
```
Then visit http://localhost:3000/api
