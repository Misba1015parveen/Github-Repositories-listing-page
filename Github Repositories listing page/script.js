let perPage = 10; 
let currentPage = 1; 
let usernameInput;

document.addEventListener('DOMContentLoaded', function () {
    usernameInput = prompt("Enter GitHub username:"); 

    if (usernameInput) {
        const repositoriesContainer = document.createElement('div');
        repositoriesContainer.classList.add('container');
        document.body.insertBefore(repositoriesContainer, document.querySelector('script'));

        fetchRepositories(usernameInput, currentPage);
    }
});

async function fetchRepositories(username, page) {
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;
    
    try {
        showLoader();
        
        const response = await fetch(apiUrl);
        const repositories = await response.json();

        hideLoader();

        if (repositories.length > 0) {
            displayRepositories(repositories);
        } else {
            console.log('No more repositories available.');
        }
    } catch (error) {
        console.error('Error fetching repositories:', error.message);
        hideLoader();
    }
}
function updatePerPage() {
    const perPageSelect = document.getElementById('perPageSelect');
    perPage = parseInt(perPageSelect.value, 10);
}

function fetchRepositoriesWithCurrentPage() {
    fetchRepositories(usernameInput, currentPage);
}

document.getElementById('perPageSelect').addEventListener('change', function () {
    updatePerPage();
    fetchRepositories(usernameInput, currentPage);
});

function displayRepositories(repositories) {
    const repositoriesContainer = document.querySelector('.container');

    repositories.forEach(repository => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');
        repoCard.innerHTML = `
            <h2>${repository.name}</h2>
            <p>${repository.description || 'No description available'}</p>
            <div class="topics">Topics: ${repository.topics.join(', ')}</div>
        `;
        repositoriesContainer.appendChild(repoCard);
    });
}

function showLoader() {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
}


function filterRepositories() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    const repoCards = document.querySelectorAll('.repo-card');

    repoCards.forEach(repoCard => {
        const repoName = repoCard.querySelector('h2').textContent.toLowerCase();
        const repoDescription = repoCard.querySelector('p').textContent.toLowerCase();

        if (repoName.includes(searchTerm) || repoDescription.includes(searchTerm)) {
            repoCard.style.display = 'block';
        } else {
            repoCard.style.display = 'none';
        }
    });
}
