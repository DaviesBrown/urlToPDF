const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const html_to_pdf = require('html-pdf-node');

const app = express();
const PORT = process.env.PORT || 3000;

let options = { format: 'A4' };

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/convert', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  let file = [{ url, name: 'webpage.pdf' }];

  try {
    html_to_pdf.generatePdfs(file, options).then(output => {
      const pdfBuffer = output[0].buffer;

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="webpage.pdf"`,
      });

      res.send(pdfBuffer);
    });
  } catch (error) {
    res.status(500).send('Failed to generate PDF');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

