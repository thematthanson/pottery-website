const express = require('express');
const path = require('path');

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle form submissions
app.post('/submit-selection', async (req, res) => {
  const { name, address, city, state, zip, potteryId } = req.body;

  // Validate received data
  if (!name || !address || !city || !state || !zip || !potteryId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Send email with selection details
    await sendSelectionEmail({ name, address, city, state, zip, potteryId });

    // Update pottery status (implementation depends on your data storage)
    await updatePotteryStatus(potteryId);

    res.status(200).json({ message: 'Selection submitted successfully.' });
  } catch (error) {
    console.error('Error processing selection:', error);
    res.status(500).json({ error: 'An error occurred while processing your selection.' });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});