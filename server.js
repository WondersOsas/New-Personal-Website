const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware: Set HTTP security headers
app.use((req, res, next) => {
  // Prevent Clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src 'self' https://solria.netlify.app https://easyfliy.netlify.app https://trew-jewel.netlify.app https://www.avoltagelogistics.com https://voltmart.cinneraofficial.workers.dev https://dipxon.com https://www.segsolns.com https://rentigram.com https://rockcrestclinics.com;"
  );
  
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Fallback routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Tech-Tezo Server] Running securely at http://localhost:${PORT}`);
});
