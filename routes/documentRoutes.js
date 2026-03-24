// const Tesseract = require('tesseract.js');
// const fs = require('fs');
// const path = require('path');

// const scanDocument = async (req, res) => {
//   try {
//     if (!req.files || !req.files.document) {
//       return res.status(400).json({ message: 'No document uploaded' });
//     }

//     const file = req.files.document;
//     const tempPath = path.join('/tmp', `doc_${Date.now()}.jpg`);
    
//     // Save file temporarily
//     await file.mv(tempPath);

//     // Run Tesseract OCR
//     const { data: { text } } = await Tesseract.recognize(tempPath, 'eng', {
//       logger: () => {}
//     });

//     // Clean up temp file
//     fs.unlinkSync(tempPath);

//     // Extract business info from text
//     const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

//     // Try to find RC number
//     const rcMatch = text.match(/RC\s*[\-:]?\s*(\d{5,9})/i);
//     const registrationNumber = rcMatch ? `RC${rcMatch[1]}` : null;

//     // Try to find amount
//     const amountMatch = text.match(/(?:₦|NGN|N)\s*([\d,]+(?:\.\d{2})?)/i) ||
//                         text.match(/(?:total|amount|sum)\s*:?\s*([\d,]+(?:\.\d{2})?)/i);
//     const amount = amountMatch ? amountMatch[1].replace(/,/g, '') : null;

//     // Try to find date
//     const dateMatch = text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/) ||
//                       text.match(/\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{2,4}/i);
//     const date = dateMatch ? dateMatch[0] : null;

//     // Try to find business name (usually first non-empty line)
//     const businessName = lines[0] || null;

//     // Calculate confidence based on how much we extracted
//     let confidence = 0;
//     if (businessName) confidence += 25;
//     if (registrationNumber) confidence += 35;
//     if (amount) confidence += 20;
//     if (date) confidence += 20;

//     res.status(200).json({
//       message: 'Document scanned successfully',
//       data: {
//         businessName,
//         registrationNumber,
//         amount,
//         date,
//         confidence,
//         rawText: text.substring(0, 500)
//       }
//     });

//   } catch (error) {
//     console.error('Scan error:', error);
//     res.status(500).json({ message: 'Failed to scan document', error: error.message });
//   }
// };

// module.exports = { scanDocument };