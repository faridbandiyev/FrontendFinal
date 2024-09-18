const API_URL = 'https://api.tvmaze.com/shows';
const showsPerPage = 12;
let currentPage = 1;
let totalShows = [];
let genres = [];
let selectedGenre = '';
let searchQuery = '';

const fetchShows = async (page) => {
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=${showsPerPage}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const fetchedShows = await response.json();
        totalShows = [...totalShows, ...fetchedShows];
        if (currentPage === 1) {
            extractGenres(totalShows);
        }
        applyFilters();
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const extractGenres = (shows) => {
    const allGenres = new Set();
    shows.forEach(show => show.genres.forEach(genre => allGenres.add(genre)));
    genres = Array.from(allGenres);
    populateGenres();
};

const populateGenres = () => {
    const genreSelect = document.getElementById('genre-select');
    genreSelect.innerHTML += genres.map(genre => `
        <option value="${genre}">${genre}</option>
    `).join('');
};

const applyFilters = () => {
    let filteredShows = totalShows;
    
    if (selectedGenre) {
        filteredShows = filteredShows.filter(show => show.genres.includes(selectedGenre));
    }
    
    if (searchQuery) {
        filteredShows = filteredShows.filter(show => 
            show.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    displayShows(filteredShows);
    if (selectedGenre || searchQuery) {
        removeSlider();
    } else {
        initSlider(totalShows.slice(0, 5));
        document.querySelector('.swiper-container').style.display = 'block';
    }
};

const removeSlider = () => {
    const swiperContainer = document.querySelector('.swiper-container');
    if (swiperContainer) {
        swiperContainer.style.display = 'none'; 
    }
};

const displayShows = (shows = totalShows) => {
    const container = document.getElementById('movies-container');
    const showsToDisplay = shows.slice(0, currentPage * showsPerPage);
    container.innerHTML = showsToDisplay.map(show => `
        <div class="movie">
            <a href="detail.html?id=${show.id}">
                <img src="${show.image.medium}" alt="${show.name}" />
                <div class="movie-info">
                    <h2>${show.name}</h2>
                </div>
            </a>
        </div>
    `).join('');
};

const initSlider = (shows) => {
    const swiperWrapper = document.querySelector('.mySwiper');
    if (swiperWrapper) {
        swiperWrapper.innerHTML = shows.map(show => `
            <swiper-slide>
                <img src="${show.image.original}" alt="${show.name}" />
            </swiper-slide>
        `).join('');

        new Swiper('.swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
};

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    searchQuery = document.getElementById('search').value.trim();
    if (searchQuery) {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
            totalShows = await response.json();
            applyFilters();
        }
    } else {
        fetchShows(currentPage);
    }
});

document.getElementById('genre-select').addEventListener('change', (e) => {
    selectedGenre = e.target.value;
    applyFilters();
});

document.getElementById('load-more').addEventListener('click', () => {
    currentPage++;
    fetchShows(currentPage);
});

fetchShows(currentPage);
