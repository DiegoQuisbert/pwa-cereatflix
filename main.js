let aviso;

window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    aviso = e;
    showAddToHomeScreen();
});

const addToHomeScreen = () =>{
    if(aviso){
        aviso.prompt();
        aviso.userChoice
        .then(function(choiceResult){
            if(choiceResult === 'accepted'){
                console.log('el usuario aceptó')
            }else{
                console.log('el usuario rechazó')
            }

            aviso = null;
        })
    }
}

const showAddToHomeScreen = () => {
    const showAlert = document.querySelector('.add-alert')
    if(showAlert != undefined){
        showAlert.style.display = "block"
        showAlert.addEventListener("click", addToHomeScreen)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchResults = document.getElementById('searchResults');
    const errorMessage = document.getElementById('errorMessage');
    const searchForm = document.querySelector('form[role=search]');

    loadSavedMovies();

    searchForm.addEventListener('submit', async event => {
        event.preventDefault();

        const searchInput = searchForm.querySelector('input[type=search]');
        const query = searchInput.value.trim();

        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=3e15ba6c`);
            const json = await response.json();

            if (json.Response === "False") {
                errorMessage.style.display = 'block';
                searchResults.innerHTML = ''; 
            } else {
                errorMessage.style.display = 'none';
                searchResults.innerHTML = ''; 

                json.Search.forEach(movie => {
                    const cardContainer = document.createElement('div');
                    cardContainer.classList.add('col');
                    
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                        <div class="card-body">
                            <h3 class="card-title">${movie.Title}</h3>
                            <p class="card-text">Año: ${movie.Year}</p>
                            <button class="btn btn-outline-warning star-button" data-movie='${JSON.stringify(movie)}'>
                                <i class="bi bi-star"></i>
                            </button>
                            <button class="btn btn-outline-danger delete-button" data-movie='${JSON.stringify(movie)}'>
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>`;
                    
                    cardContainer.appendChild(card);
                    searchResults.appendChild(cardContainer);
                });

                const starButtons = document.querySelectorAll('.star-button');
                const deleteButtons = document.querySelectorAll('.delete-button');
                
                starButtons.forEach(button => {
                    button.addEventListener('click', saveMovie);
                });
                
                deleteButtons.forEach(button => {
                    button.addEventListener('click', deleteMovie);
                });
            }
        } catch (error) {
            console.error('Error al buscar la película:', error);
            errorMessage.style.display = 'block';
        }

        searchInput.value = '';
    });
});

function saveMovie(event) {
    const button = event.currentTarget;
    const movie = JSON.parse(button.getAttribute('data-movie'));

    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    const movieExists = savedMovies.some(savedMovie => savedMovie.imdbID === movie.imdbID);

    if (!movieExists) {
        savedMovies.push(movie);
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
        console.log('Película guardada:', movie.Title);

        const confirmationMessage = document.createElement('p');
        confirmationMessage.classList.add('text-success', 'mt-2');
        confirmationMessage.textContent = 'Película añadida a favoritos';

        const card = button.closest('.col');
        const cardBody = card.querySelector('.card-body');
        cardBody.appendChild(confirmationMessage);

        setTimeout(() => {
            confirmationMessage.remove();
        }, 3000);
    } else {
        console.log('La película ya está guardada:', movie.Title);
    }
}

function deleteMovie(event) {
    const button = event.currentTarget;
    const movie = JSON.parse(button.getAttribute('data-movie'));

    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    const updatedMovies = savedMovies.filter(savedMovie => savedMovie.imdbID !== movie.imdbID);

    localStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
    console.log('Película eliminada:', movie.Title);

    const card = button.closest('.col');
    if (card) {
        card.remove();
    }
}

function loadSavedMovies() {
    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    const searchResults = document.getElementById('searchResults');

    savedMovies.forEach(movie => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('col');
        
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h3 class="card-title">${movie.Title}</h3>
                <p class="card-text">Año: ${movie.Year}</p>
                <button class="btn btn-outline-warning star-button" data-movie='${JSON.stringify(movie)}'>
                    <i class="bi bi-star"></i>
                </button>
                <button class="btn btn-outline-danger delete-button" data-movie='${JSON.stringify(movie)}'>
                    <i class="bi bi-trash"></i>
                </button>
            </div>`;
        
        cardContainer.appendChild(card);
        searchResults.appendChild(cardContainer);
    });

    const starButtons = document.querySelectorAll('.star-button');
    const deleteButtons = document.querySelectorAll('.delete-button');
    
    starButtons.forEach(button => {
        button.addEventListener('click', saveMovie);
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteMovie);
    });
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Service Worker registrado con éxito:', registration);
        })
        .catch(error => {
            console.log('Error al registrar el Service Worker:', error);
        });
} else {
    console.log('Service Worker no es soportado en este navegador.');
}
