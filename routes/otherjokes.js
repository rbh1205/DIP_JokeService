// jokes.js
const controller = require("../controller/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

 function isJsonParsable(string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}

router
    .get('/:site', async (request, response) => {
        try {
            let result1 = await get("https://krdo-joke-registry.herokuapp.com/api/services")
            let result2
            for (site of result1) {
                if (site._id == request.params.site) {
                    let url = site.address
                    if(url[url.length - 1] != '/'){
                        url += '/'
                    }
                   
                    result2 = await get(url + 'api/jokes')
                }
            }
         
                response.send(result2)
            
        } catch (e) {
            sendStatus(e, response);
        }

    })

function sendStatus(e, response) {
    console.error("Exception: " + e);
    if (e.stack) console.error(e.stack);
    response.status(500).send(e);
}

module.exports = router;