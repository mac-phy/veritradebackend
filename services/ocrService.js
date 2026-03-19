const Tesseract = require('tesseract.js');
const fs = require('fs');

const extractTextFromImage = async (imagePath) => {
  try {
    console.log('🔍 Starting OCR on:', imagePath);
    
    const { data: { text, confidence } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: (m) => console.log('OCR Progress:', m)
      }
    );

    console.log('✅ OCR completed. Confidence:', confidence);

    // Extract business information
    const extracted = {
      rawText: text,
      businessName: extractBusinessName(text),
      registrationNumber: extractRegistrationNumber(text),
      amount: extractAmount(text),
      date: extractDate(text),
      confidence: Math.round(confidence)
    };

    return extracted;
  } catch (error) {
    console.error('❌ OCR Error:', error.message);
    throw new Error('Failed to process document');
  }
};

const extractBusinessName = (text) => {
  // Look for common patterns
  const lines = text.split('\n').filter(l => l.trim());
  // Assume business name is in first few lines
  for (let line of lines.slice(0, 5)) {
    if (line.length > 5 && line.length < 100) {
      return line.trim();
    }
  }
  return null;
};

const extractRegistrationNumber = (text) => {
  // Look for CAC number pattern: RC followed by numbers
  const rcMatch = text.match(/RC[\s-]?(\d{6,})/i);
  if (rcMatch) return rcMatch[0];
  
  // Look for any number sequence that might be registration
  const numMatch = text.match(/\b\d{6,}\b/);
  return numMatch ? numMatch[0] : null;
};

const extractAmount = (text) => {
  // Look for currency amounts
  const amountMatch = text.match(/(?:₦|NGN|N|USD|\$)\s*[\d,]+(?:\.\d{2})?/i);
  if (amountMatch) {
    const cleaned = amountMatch[0].replace(/[^\d.]/g, '');
    return parseFloat(cleaned);
  }
  return null;
};

const extractDate = (text) => {
  // Look for date patterns
  const dateMatch = text.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/);
  return dateMatch ? dateMatch[0] : null;
};

module.exports = { extractTextFromImage };
