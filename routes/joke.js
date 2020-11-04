// jokes.js
const controller = require("../controller/controller");
const express = require('express');
const router = express.Router();
const nodefetch = require('node-fetch')

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

router
    .get('/api/jokes', async (request, response) => {
        try {
            let jokes = await controller.getJokes();
            response.send(jokes);
        } catch (e) {
            sendStatus(e, response);
        }
    })
    .get('/api/othersites', async (request, response) => {
        try {
            let result = await get("https://krdo-joke-registry.herokuapp.com/api/othersites")
            response.send(result)
        } catch (e) {
            sendStatus(e, response);
        }
    })
    .get('/api/othersites/:joke', async (request, response) => {
        try {
            let jokes = await controller.getJokes();
            response.send(jokes);
        } catch (e) {
            sendStatus(e, response);
        }
    })
    .post('/api/jokes', async (request, response) => {
        try {
            let { setup, punchline } = request.body;
            await controller.createJoke(setup, punchline);

        } catch (e) {
            sendStatus(e, response);
        }
        // response.send({ message: 'Joke saved!' });
        response.sendStatus(201);
    }
    );

function sendStatus(e, response) {
    console.error("Exception: " + e);
    if (e.stack) console.error(e.stack);
    response.status(500).send(e);
}

module.exports = router;

async function createjokefunc() {
    await controller.createJoke('Alle børnene slap ud af fængslet', 'Undtaget Peter, han nåede kun 500 meter')
}

// createjokefunc() 