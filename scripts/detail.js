const showId = new URLSearchParams(window.location.search).get('id');

const fetchShowDetails = async () => {
    try {
        const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const show = await response.json();
        displayShowDetails(show);
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('movie-detail').innerHTML = '<p>Failed to load show details. Please try again later.</p>';
    }
};

const displayShowDetails = (show) => {
    const container = document.getElementById('movie-detail');
    container.innerHTML = `
        <div class="movie-detail">
            <img src="${show.image.original}" alt="${show.name}" />
            <div class="show-detail-info">
                <h1>${show.name}</h1>
                <p>${show.summary || 'No summary available'}</p>
                <p><strong>Genres:</strong> ${show.genres.join(', ')}</p>
                <p><strong>Language:</strong> ${show.language}</p>
                <p><strong>Runtime:</strong> ${show.runtime} minutes</p>
                <p><strong>Status:</strong> ${show.status}</p>
                <p><strong>Premiered:</strong> ${show.premiered}</p>
                <p><strong>Ended:</strong> ${show.ended || 'Ongoing'}</p>
                <p><strong>Average Rating:</strong> ${show.rating.average || 'N/A'}</p>
                <p><strong>Official Site:</strong> <a href="${show.officialSite}" target="_blank">${show.officialSite}</a></p>
            </div>
        </div>
    `;
};

fetchShowDetails();
