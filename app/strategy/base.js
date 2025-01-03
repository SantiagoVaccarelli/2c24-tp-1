import fetch from 'node-fetch';
import { Router } from 'express';
import StatsD from 'hot-shots';


const baseRouter = Router();

const statsd = new StatsD({
    host: 'graphite',
    port: 8125,
    prefix: 'endpoint.'
});

baseRouter.get('/ping', (req, res) => {
    console.log('ping base')
    res.send('ping')
  })

baseRouter.get('/dictionary', async (req, res) => {
    const startTotal = Date.now();
    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + req.query.word;
    try {
        const startAPI = Date.now();
        const response = await fetch(url);
        const endAPI = Date.now();
        
        statsd.timing('api.response_time', endAPI - startAPI);
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const word = {
            'phonetics': json[0].phonetics,
            'meanings': json[0].meanings,
        };

        console.log(word);
        res.send(word)
    } catch (error) {
        console.error(error.message);
    } finally {
        const endTotal = Date.now();
        statsd.timing('api.total_response_time', endTotal - startTotal);
    }
})

baseRouter.get('/spaceflight_news', async (req, res) => {
    const startTotal = Date.now();
    const url = "https://api.spaceflightnewsapi.net/v4/articles/?limit=5";
    try {
        const startAPI = Date.now();
        const response = await fetch(url);
        const endAPI = Date.now();
        
        statsd.timing('api.response_time', endAPI - startAPI);
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const titles = json.results.map(news => news.title);

        console.log(titles);
        res.send(titles)
    } catch (error) {
        console.error(error.message);
    } finally {
        const endTotal = Date.now();
        statsd.timing('api.total_response_time', endTotal - startTotal);
    }
})

baseRouter.get('/quote', async (req, res) => {
    const startTotal = Date.now();
    const url = "https://uselessfacts.jsph.pl/api/v2/facts/random";
    try {
        const startAPI = Date.now();
        const response = await fetch(url);
        const endAPI = Date.now();
        
        statsd.timing('api.response_time', endAPI - startAPI);
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        res.send(json)
    } catch (error) {
        console.error(error.message);
    } finally {
        const endTotal = Date.now();
        statsd.timing('api.total_response_time', endTotal - startTotal);
    }
})


export default baseRouter;