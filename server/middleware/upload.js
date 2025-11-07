const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-z0-9.\-\_]/gi, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

// Only allow common resume types
function fileFilter(req, file, cb) {
  const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported file type'), false);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

module.exports = upload;
