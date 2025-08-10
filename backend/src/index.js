const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth");
const projectsRoute = require("./routes/projects");
const milestonesRoute = require("./routes/milestones");
const adminRoute = require("./routes/admin");
const fundingRoute = require("./routes/funding");
const applicationsRoute = require("./routes/applications");
require("dotenv").config();

const app = express();

// Configure CORS properly
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:8081', 
      'http://localhost:8082', 
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://localhost:5173',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:8082',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Headers:', req.headers);
  next();
});

app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});

// Test endpoint for CORS
app.get('/test', (req, res) => {
    res.json({ message: 'CORS test successful', timestamp: new Date().toISOString() });
});

app.use("/auth", authRoute);
app.use("/projects", projectsRoute);
app.use("/milestones", milestonesRoute);
app.use("/admin", adminRoute);
app.use("/funding", fundingRoute);
app.use("/applications", applicationsRoute);

app.listen(3001, () => console.log("Server running on port 3001"));
