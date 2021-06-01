const urlAll = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=150/';
const urlBase = 'https://pokeapi.co/api/v2/pokemon/';
let pokemonsDetails = [];
let pokemonsName = [];
let pokemonsFiltered = [];
let inputFilter = null;
let btnFilter = null;
let pokemonDiv = null;
let pokemons = null;

window.addEventListener("load", () => {
    initializeComponents();
});
async function initializeComponents() {
    inputFilter = document.querySelector("#inputFilter");
    btnFilter = document.querySelector("#btnFilter");
    pokemonDiv = document.querySelector("#pokemons");
    await fetchAllPokemonsNames(urlAll);
    await fetchPokemonsDetails();
    await mapperPokemons();
    pokemonsFiltered = pokemons
    render()
    configFilter();
}

async function fetchAllPokemonsNames(url) {
    const request = await fetch(url);
    const json = await request.json();
    pokemonsName = json.results.map(pokemon => {
        const { name } = pokemon;
        return {
            name
        }
    });
}

async function fetchPokemonsDetails() {
    for (const pokemon of pokemonsName) {
        const request = await fetch(urlBase + pokemon.name);
        const json = await request.json();
        pokemonsDetails.push(json)
    }
}


async function mapperPokemons() {
    pokemons = pokemonsDetails.map(pokemon => {
        return {
            name: pokemon.name,
            id: pokemon.id,
            type: pokemon.types.map(type => type.type.name),
            weight: pokemon.weight,
            height: pokemon.height,
            image: pokemon.sprites.other.dream_world.front_default
        }
    })
}

function render() {
    let pokemonsHTML = "<div class='pokemon'>";
    pokemonsFiltered.forEach(pokemon => {
        const { name, id, type, weight, height, image } = pokemon
        const pokemonHtml = ` <div class="card">
        <div class="card-image">
            <img src="${image}"
                alt="${name}">
        </div>
        <div class="card-content">
            <span class="id">Nº${id}</span>
            <h2 class="name">${name}</h2>
            <p class="peso">Peso: ${weight / 10}kg</p>
            <p class="altura">Altura: ${height / 10}m</p>
            <p class="tipos">Tipos: <span>${type}</span></p>
        </div>
    </div>`
        pokemonsHTML += pokemonHtml;
    });
    pokemonDiv.innerHTML = pokemonsHTML;
}

function configFilter() {
    inputFilter.addEventListener('keyup', handlerFilterKeyUp)
    btnFilter.addEventListener('click', handlerFilterButttonClick)
}

function handlerFilterButttonClick() {
    const filter = inputFilter.value.toLowerCase().trim();
    pokemonsFiltered = pokemons.filter(item => {
        return item.name.toLowerCase().includes(filter);
    });
    render()
}

function handlerFilterKeyUp({ key }) {
    if (inputFilter.value === "") {
        pokemonsFiltered = pokemons;
        render()
    }
    if (key !== 'Enter') {
        return;
    }
    handlerFilterButttonClick();
}


