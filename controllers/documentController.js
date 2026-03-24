// const Anthropic = require('@anthropic-ai/sdk');

// const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// const scanDocument = async (req, res) => {
//   try {
//     if (!req.files || !req.files.document) {
//       return res.status(400).json({ message: 'No document uploaded' });
//     }

//     const file = req.files.document;
//     const base64Image = file.data.toString('base64');
//     const mediaType = file.mimetype;

//     const response = await client.messages.create({
//       model: 'claude-opus-4-6',
//       max_tokens: 1024,
//       messages: [
//         {
//           role: 'user',
//           content: [
//             {
//               type: 'image',
//               source: {
//                 type: 'base64',
//                 media_type: mediaType,
//                 data: base64Image,
//               },
//             },
//             {
//               type: 'text',
//               text: `Extract business information from this document. Return ONLY a JSON object with these fields:
// {
//   "businessName": "extracted business name or null",
//   "registrationNumber": "RC number or null",
//   "amount": "total amount as number or null",
//   "date": "date as string or null",
//   "confidence": confidence percentage as number between 0-100
// }
// Return ONLY the JSON, no other text.`
//             }
//           ],
//         }
//       ],
//     });

//     const text = response.content[0].text;
//     const clean = text.replace(/```json|```/g, '').trim();
//     const extracted = JSON.parse(clean);

//     res.status(200).json({
//       message: 'Document scanned successfully',
//       data: extracted
//     });

//   } catch (error) {
//     console.error('Scan error:', error);
//     res.status(500).json({ message: 'Failed to scan document', error: error.message });
//   }
// };

// module.exports = { scanDocument };