// index.js
async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

async function post(url, objekt) {
    const respons = await fetch(url, {
        method: "POST",
        body: JSON.stringify(objekt),
        headers: { 'Content-Type': 'application/json' }
    });
    if (respons.status !== 201) // Created
        throw new Error(respons.status);
    return await respons.json();
}

async function getText(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.text();
}

async function generateJokesTable(jokes) {
    let template = await getText('/index.hbs');
    let compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({ jokes });
}

async function main(url) {
    try {
        let jokes = await get(url);
        let div = document.getElementById('jokesdiv')
        div.innerHTML = await generateJokesTable(jokes);
    } catch (e) {
        console.log(e.name + ": " + e.message);
    }
}
main('/api/jokes');

let opretButton = document.getElementById('opretButton')
let setupField = document.getElementById('setup')
let punchlineField = document.getElementById('punchline')

opretButton.onclick = async () => {
    if (setupField.value && punchlineField.value) {
        try {
            await post("/api/jokes", { setup: setupField.value, punchline: punchlineField.value });
        } catch (e) {
        }
        setupField.value = ""
        punchlineField.value = ""
        main('/api/jokes')
    }
}

let rydButton = document.getElementById('clear')

rydButton.onclick = () => {
    setupField.value = ""
    punchlineField.value = ""
}

let selectSite = document.getElementById('selectSite')

let othersitesObjects = []

selectSite.onchange = async () => {
    try{
        let id;
        for (site of othersitesObjects) {
            if (site.name === selectSite.value) {
                id = site._id
            }
         }
        let jokes = await get("/api/otherjokes/" + id)
        let div = document.getElementById('jokesdiv')
        div.innerHTML = await generateJokesTable(jokes);
    }
    catch(e){
        
    }
}



async function getSites() {
    try {
        let result = await get('/api/othersites');
        othersitesObjects = result
        createSelect(result)
    }
    catch (e) {
        console.log(e);
    }
}

function createSelect(result) {
    let siteArray = []
    for (let i = 0; i < result.length; i++) {
        siteArray.push(result[i].name)
        let option = document.createElement('option')
        option.text = siteArray[i]
        selectSite.add(option, i)
    }

}
getSites()





