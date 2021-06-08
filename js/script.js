const urlAll = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=150/';
const urlBase = 'https://pokeapi.co/api/v2/pokemon/';
let pokemonsDetails = [];
let pokemonsName = [];
let pokemonsFiltered = [];
let inputFilter = null;
let btnFilter = null;
let pokemonDiv = null;
let pokemons = null;
let cardPokemon = null;
let modal = null;
let close = null;

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

async function fetchPokemonsDetailsID(id) {
    const request = await fetch(urlBase + id);
    const json = await request.json();
    return json;
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
        const pokemonHtml = ` <div class="card" id="${id}" onclick="detailsPokemon(${pokemon.id})">
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

async function detailsPokemon(id) {
    let pokemon = await fetchPokemonsDetailsID(id);
    document.querySelector(".modal").innerHTML = `
    <div id="modal" class="">
    <div class="content">
        <div class="header">
            <h1>Titulo Pokemon</h1>
            <a href="#" onClick="fechar()">Fechar</a>
        </div>
        <div class="container">
            <div class="img-pokemon">
                <img src="${pokemon.sprites.other.dream_world.front_default}" width="250px" alt="${pokemon.name}">
            </div>
            <div class="content-pokemon">
                <div class="initial-data">
                    <span class="id">Nº${pokemon.id}</span>
                    <h2 class="name">${pokemon.name}</h2>
                    <p class="peso">Peso: ${pokemon.weight / 10}kg</p>
                    <p class="altura">Altura: ${pokemon.height / 10}m</p>
                    <p class="tipos">Tipos: <span>${pokemon.types.map(type => type.type.name)}</span></p>
                </div>
            </div>
        </div>
    </div>
</div>
    `


}

function fechar() {
    document.querySelector("#modal").classList.add("hide")
}