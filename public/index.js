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

async function main() {
    try {
        let jokes = await get('/joke/api/jokes');
        let div = document.getElementById('jokesdiv')
        div.innerHTML = await generateJokesTable(jokes);
    } catch (e) {
        console.log(e.name + ": " + e.message);
    }
}
main();

let opretButton = document.getElementById('opretButton')
let setupField = document.getElementById('setup')
let punchlineField = document.getElementById('punchline')

opretButton.onclick = async () => {
    if (setupField.value && punchlineField.value) {
        try {
            await post("/joke/api/jokes", { setup: setupField.value, punchline: punchlineField.value });
        } catch (e) {
        }
        setupField.value = ""
        punchlineField.value = ""
        main()
    }
}

let rydButton = document.getElementById('clear')

rydButton.onclick = () => {
    setupField.value = ""
    punchlineField.value = ""
}

let selectSite = document.getElementById('selectSite')


async function getSites() {
    try {
        let result = await get('/joke/api/othersites');
        createSelect(result)

    }
    catch (e) {
        console.log(e);
    }
}

function createSelect(result) {
    let siteArray = []
    for (let i = 0; i < result.length; i++) {
        siteArray.push(result[i].address)
        let option = document.createElement('option')
        option.text = siteArray[i]
        selectSite.add(option, i)
    }

}
getSites()



