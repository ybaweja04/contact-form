const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // For loading env variables

// Setting up the server
const app = express();
const PORT = process.env.PORT || 5001; // Use 5001 if 5000 is in use

// Middleware
app.use(cors()); // Cross-origin allow
app.use(express.json()); // Parse incoming JSON requests

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// Route to handle email sending
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    console.log('Request body:', req.body); // Log the incoming request body

    // Creating transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'recipient@gmail.com',
        subject: `Contact form submission from ${name}`,
        text: `You have a new contact form submission:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Sending email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error while sending email:', error); // Log the error if sending fails
            return res.status(500).json({ error: error.message }); // Send error message back to frontend
        }
        console.log('Email sent successfully:', info.response); // Log success
        res.status(200).json({ message: 'Email sent successfully', info: info.response });
    });
});


// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
