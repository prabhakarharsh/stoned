const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const pdf = require('pdf-parse');
const fs = require('fs');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Key Security Middleware
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.FRONTEND_API_KEY) {
    console.warn(`Unauthorized API access attempt with key: ${apiKey}`);
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
  }
  next();
});

// Setup storage for custom ringtones
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/ringtones';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const supabase = require('./supabaseClient');

// --- Routes ---

// Get all alarms
app.get('/api/alarms', async (req, res) => {
  const { data, error } = await supabase
    .from('alarms')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json(error);
  res.json(data);
});

// Create/Update alarm
app.post('/api/alarms', async (req, res) => {
  const alarm = req.body;
  
  // Prep data for Supabase (handle id correctly for upsert)
  const alarmData = {
    time: alarm.time,
    ampm: alarm.ampm,
    label: alarm.label,
    active: alarm.active,
    days: alarm.days,
    ringtone: alarm.ringtone
  };

  if (alarm.id) {
    alarmData.id = alarm.id;
  }

  const { data, error } = await supabase
    .from('alarms')
    .upsert(alarmData)
    .select();

  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

// Upload ringtone
app.post('/api/upload-ringtone', upload.single('ringtone'), (req, res) => {
  res.json({ 
    success: true, 
    filename: req.file.filename,
    path: `/uploads/ringtones/${req.file.filename}`
  });
});

// Analyze File
app.post('/api/analyze-file', upload.single('file'), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    
    // Sophisticated Regex to find times and sentences
    const text = data.text;
    const timeRegex = /(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/g;
    const events = [];
    
    // Split into lines/sentences
    const lines = text.split(/\n|\. /);
    
    lines.forEach(line => {
      const match = line.match(timeRegex);
      if (match) {
        events.push({
          time: match[0],
          title: line.replace(match[0], '').trim().substring(0, 50) + '...',
          description: line.trim()
        });
      }
    });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
