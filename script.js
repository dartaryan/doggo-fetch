let pokemonArray = [];
let pokemonNames = [];
let correctGuesses = 0;
let totalGuesses = 0;
const maxGuesses = 4;

// Utility Functions
function getRandomElement(array) {
    const i = Math.floor(Math.random() * array.length);
    return array[i];
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// API Call
async function fetchPokemon() {
    const fetchedPokemon = [];
    for (let i = 1; i <= 20; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${ i }`;
        let response = await fetch(url);
        let data = await response.json();
        let pokemon = {
            name: data.name,
            image: data.sprites.other.dream_world.front_default,
            art: data.sprites.versions["generation-v"]["black-white"].animated.front_default,
        };
        console.log(data)
        fetchedPokemon.push(pokemon);
    }
    return fetchedPokemon;
}

// Choices
function getMultipleChoices(n, correctAnswer, possibleAnswers) {
    const choices = [correctAnswer];
    while (choices.length < n) {
        const choice = getRandomElement(possibleAnswers);
        if (!choices.includes(choice)) choices.push(choice);
    }
    return shuffleArray(choices);
}

function getPokemonNames(pokemonObjects) {
    return pokemonObjects.map(pokemon => pokemon.name);
}

// Rendering
function renderButtons(choicesArray, correctAnswer, artImages) {
    const options = document.getElementById("options");
    options.innerHTML = '';

    function buttonHandler(e) {
        if (e.target.value === correctAnswer) {
            e.target.classList.add("correct");
            correctGuesses++;
            displayArtImages(artImages);
        } else {
            e.target.classList.add("incorrect");
            displaySadAsh();
            document.querySelector(`button[value="${ correctAnswer }"]`).classList.add("correct");
        }
        totalGuesses++;
        updateScore();
        setTimeout(() => {
            if (totalGuesses < maxGuesses) {
                loadNewQuiz();
            } else {
                endGame();
            }
        }, 6000); // Delay to show the correct/incorrect answer animation
    }

    choicesArray.forEach(choice => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.value = choice;
        button.name = choice;
        button.addEventListener("click", buttonHandler);
        options.appendChild(button);
    });
}

function renderQuiz(imgUrl, correctAnswer, choices, artImage) {
    const image = document.createElement("img");
    image.setAttribute("src", imgUrl);
    image.setAttribute("id", "pokemon-image");
    const frame = document.getElementById("image-frame");

    image.addEventListener("load", () => {
        frame.replaceChildren(image);
        renderButtons(choices, correctAnswer, artImage);
    });
}

function displayArtImages(artImage) {
    const image = document.getElementById("pokemon-image");
    image.setAttribute("src", artImage);
    image.classList.add("fadeInGrow");
    setTimeout(() => {
        image.classList.remove("fadeInGrow");
    }, 1000); // Adjust the duration based on your animation time
}

function displaySadAsh() {
    const frame = document.getElementById("image-frame");
    frame.innerHTML = '';
    const sadAshImage = document.createElement("img");
    sadAshImage.setAttribute("src", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4a243a29-186e-46e2-b5fd-3581c92b8930/dbv37rk-8a4883fd-d7af-4b15-b396-28ebd59393bb.png/v1/fit/w_720,h_416/png___pkmn_movie_4___ash_sad_by_supercaptainn_dbv37rk-375w-2x.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDE2IiwicGF0aCI6IlwvZlwvNGEyNDNhMjktMTg2ZS00NmUyLWI1ZmQtMzU4MWM5MmI4OTMwXC9kYnYzN3JrLThhNDg4M2ZkLWQ3YWYtNGIxNS1iMzk2LTI4ZWJkNTkzOTNiYi5wbmciLCJ3aWR0aCI6Ijw9NzIwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.PNDLO18MSRMyJ0abjZ-VVvy7Qdvo3ZOSmPwIxmfmei0");
    sadAshImage.setAttribute("id", "sad-ash-image");
    sadAshImage.classList.add("fadeInOut");
    frame.appendChild(sadAshImage);
}

async function loadQuizData() {
    document.getElementById("image-frame").textContent = "Fetching Pokémon...";
    pokemonArray = await fetchPokemon();
    pokemonNames = getPokemonNames(pokemonArray);
    loadNewQuiz();
}

function loadNewQuiz() {
    const options = document.getElementById("options");
    options.innerHTML = ''; // Clear previous options
    let currentPokemon = getRandomElement(pokemonArray);
    const correctName = currentPokemon.name;
    const previewImg = currentPokemon.image;
    const pokemonChoices = getMultipleChoices(4, correctName, pokemonNames);
    const artImage = currentPokemon.art
    renderQuiz(previewImg, correctName, pokemonChoices, artImage);
}

function updateScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${ correctGuesses } / ${ totalGuesses }`;
}

function endGame() {
    document.getElementById("image-frame").textContent = "Game Over!";
    document.getElementById("options").innerHTML = '';
    alert(`Game Over! Your final score is ${ correctGuesses } out of ${ totalGuesses }.`);
}

// Initialization
(async function () {
    const scoreElement = document.createElement("div");
    scoreElement.id = "score";
    scoreElement.textContent = "Score: 0 / 0";
    document.body.insertBefore(scoreElement, document.querySelector("main"));
    await loadQuizData();
})();
