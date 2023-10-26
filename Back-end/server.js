import express from 'express';
import cors from 'cors';
import { URL } from 'url';
import { scrapeWebsite } from './scraper.js';

const app = express();

function urlValidation(inputUrl) {
    try {
        const parsedUrl = new URL(inputUrl);
        return true;
    } catch (error) {
        return false;
    }
}

app.use(cors());

app.get('/scrape', (req, res) => {
    const { url } = req.query;

    if (!url) {
        res.status(400).send({ error: 'URL is required!' });
        return;
    }

    if (!urlValidation(url)) {
        res.status(400).send({ error: 'Invalid URL format' });
        return;
    }

    scrapeWebsite(url)
        .then(result => {
            res.send({ data: result });
        });

});

app.listen(8000, () => console.log('Listening on port 8000'));