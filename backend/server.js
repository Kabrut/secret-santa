const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production and development
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());

// Initialize NeDB databases
const configDb = new Datastore({ filename: path.join(__dirname, 'data/config.db'), autoload: true });
const drawsDb = new Datastore({ filename: path.join(__dirname, 'data/draws.db'), autoload: true });

// Fisher-Yates shuffle algorithm for true randomness
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate valid Secret Santa assignments
function generateAssignments(participants) {
  if (participants.length < 2) {
    throw new Error('Need at least 2 participants');
  }

  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    const shuffled = shuffleArray(participants);
    let valid = true;

    // Check if anyone drew themselves
    for (let i = 0; i < participants.length; i++) {
      if (participants[i] === shuffled[i]) {
        valid = false;
        break;
      }
    }

    if (valid) {
      const assignments = {};
      for (let i = 0; i < participants.length; i++) {
        assignments[participants[i]] = shuffled[i];
      }
      return assignments;
    }

    attempts++;
  }

  throw new Error('Could not generate valid assignments');
}

// API Routes

// Get current configuration
app.get('/api/config', (req, res) => {
  configDb.findOne({}, (err, config) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!config) {
      return res.json({ participants: [], maxPrice: 0, initialized: false });
    }
    res.json({
      participants: config.participants || [],
      maxPrice: config.maxPrice || 0,
      initialized: true
    });
  });
});

// Set configuration (admin only)
app.post('/api/config', (req, res) => {
  const { participants, maxPrice } = req.body;

  if (!participants || !Array.isArray(participants) || participants.length < 2) {
    return res.status(400).json({ error: 'Need at least 2 participants' });
  }

  if (!maxPrice || maxPrice <= 0) {
    return res.status(400).json({ error: 'Max price must be greater than 0' });
  }

  // Clear existing draws when config changes
  drawsDb.remove({}, { multi: true }, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to clear draws' });
    }

    configDb.remove({}, { multi: true }, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to clear config' });
      }

      const config = {
        participants: participants.map(p => p.trim()).filter(p => p),
        maxPrice: parseFloat(maxPrice),
        createdAt: new Date()
      };

      configDb.insert(config, (err, newConfig) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to save config' });
        }
        res.json({ success: true, config: newConfig });
      });
    });
  });
});

// Draw a name
app.post('/api/draw', (req, res) => {
  const { participantName } = req.body;

  if (!participantName || !participantName.trim()) {
    return res.status(400).json({ error: 'Participant name is required' });
  }

  const name = participantName.trim();

  // Check if this person already drew
  drawsDb.findOne({ giver: name }, (err, existingDraw) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingDraw) {
      return res.json({ 
        alreadyDrawn: true, 
        receiver: existingDraw.receiver 
      });
    }

    // Get config and generate assignments if needed
    configDb.findOne({}, (err, config) => {
      if (err || !config) {
        return res.status(500).json({ error: 'Configuration not found' });
      }

      if (!config.participants.includes(name)) {
        return res.status(400).json({ error: 'Not a valid participant' });
      }

      // Check if assignments exist
      drawsDb.findOne({}, (err, anyDraw) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // If no draws exist at all, generate ALL assignments and save them
        if (!anyDraw) {
          try {
            const assignments = generateAssignments(config.participants);
            
            // Create all draw records at once
            const allDraws = config.participants.map(participant => ({
              giver: participant,
              receiver: assignments[participant],
              drawnAt: new Date(),
              revealed: false
            }));

            // Save all assignments to database
            drawsDb.insert(allDraws, (err) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to save assignments' });
              }

              // Mark this person's draw as revealed
              drawsDb.update(
                { giver: name },
                { $set: { revealed: true, revealedAt: new Date() } },
                {},
                (err) => {
                  if (err) {
                    console.error('Failed to mark as revealed:', err);
                  }

                  res.json({
                    alreadyDrawn: false,
                    receiver: assignments[name],
                    maxPrice: config.maxPrice
                  });
                }
              );
            });
          } catch (error) {
            return res.status(500).json({ error: 'Failed to generate assignments' });
          }
        } else {
          // Assignments already exist, find this person's draw
          drawsDb.findOne({ giver: name }, (err, draw) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            if (!draw) {
              return res.status(400).json({ error: 'Assignment not found for this participant' });
            }

            // Mark as revealed if not already
            if (!draw.revealed) {
              drawsDb.update(
                { giver: name },
                { $set: { revealed: true, revealedAt: new Date() } },
                {},
                (err) => {
                  if (err) {
                    console.error('Failed to mark as revealed:', err);
                  }
                }
              );
            }

            res.json({
              alreadyDrawn: draw.revealed,
              receiver: draw.receiver,
              maxPrice: config.maxPrice
            });
          });
        }
      });
    });
  });
});

// Get draw result (if already drawn)
app.get('/api/draw/:participantName', (req, res) => {
  const name = req.params.participantName.trim();

  drawsDb.findOne({ giver: name }, (err, draw) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!draw) {
      return res.json({ drawn: false });
    }

    configDb.findOne({}, (err, config) => {
      if (err || !config) {
        return res.status(500).json({ error: 'Configuration not found' });
      }

      res.json({
        drawn: true,
        receiver: draw.receiver,
        maxPrice: config.maxPrice
      });
    });
  });
});

// Get all draws (for admin panel and public results)
app.get('/api/draws', (req, res) => {
  drawsDb.find({}, (err, draws) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    configDb.findOne({}, (err, config) => {
      if (err || !config) {
        return res.status(500).json({ error: 'Configuration not found' });
      }

      res.json({
        draws: draws,
        maxPrice: config.maxPrice,
        totalParticipants: config.participants.length,
        completedDraws: draws.length
      });
    });
  });
});

// Reset draws only (admin only) - keeps configuration
app.post('/api/reset', (req, res) => {
  drawsDb.remove({}, { multi: true }, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to reset draws' });
    }
    res.json({ success: true, message: 'Draws reset successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
