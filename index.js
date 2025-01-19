// Servidor HTTP

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';


app.get('/', async (requestAnimationFrame, res) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const links = [];

        $('#mw-pages a').each((index, element) => {
            const link = $(element).attr('href');
            if (link) {
                links.push(`https://es.wikipedia.org${link}`);
            }
        });

        const results = [];

        for (const link of links) {
            const { data: pageData } = await axios.get(link);
            const $$ = cheerio.load(pageData);

            const title = $$('h1').text();
            const images = [];
            $$('img').each((index, element) => {
                images.push($(element).attr('src'));
            });

            const paragraphs = [];
            $$('p').each((index, element) => {
                paragraphs.push($$(element).text());
            });

            results.push({ title, images, paragraphs });
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al reaizar el scraping');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});