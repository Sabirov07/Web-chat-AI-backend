const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const scrapedData = await page.content();

    await browser.close();

    fs.writeFileSync('web-data.txt', scrapedData);

    res.json({ data: scrapedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scrape website' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
