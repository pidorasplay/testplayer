let allAnime = [];
let currentAnime = null;
let currentEpisode = 1;

async function loadAnimeData() {
  try {
    const response = await fetch('data/anime.json');
    allAnime = await response.json();
    populateAnimeSelector();
    
    // Check for last watched
    const lastWatchedAnimeId = localStorage.getItem('last_watched_anime');
    if (lastWatchedAnimeId) {
        const anime = allAnime.find(a => a.anime_id == lastWatchedAnimeId);
        if (anime) {
            selectAnime(anime.anime_id);
            document.getElementById('anime-selector').value = anime.anime_id;
        }
    }
  } catch (error) {
    console.error('Error loading anime data:', error);
  }
}

function populateAnimeSelector() {
    const selector = document.getElementById('anime-selector');
    allAnime.forEach(anime => {
        const option = document.createElement('option');
        option.value = anime.anime_id;
        option.textContent = anime.title;
        selector.appendChild(option);
    });
    
    selector.onchange = (e) => selectAnime(e.target.value);
}

function selectAnime(animeId) {
    currentAnime = allAnime.find(a => a.anime_id == animeId);
    if (currentAnime) {
        localStorage.setItem('last_watched_anime', animeId);
        renderEpisodeList(currentAnime);
    }
}

function renderEpisodeList(anime) {
    const list = document.getElementById('episodes');
    list.innerHTML = '';
    // Only show available episodes
    for (let i = 1; i <= anime.available_episodes; i++) {
        const li = document.createElement('li');
        li.textContent = `Серия ${i}`;
        li.onclick = () => loadEpisode(anime.anime_id, i);
        list.appendChild(li);
    }
}

function loadEpisode(animeId, episodeId) {
    currentEpisode = episodeId;
    
    // Update player source
    const stream = `videos/${animeId}/${episodeId}/index.m3u8`;
    
    const video = document.getElementById('video');
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(stream);
        hls.attachMedia(video);
    } else {
        video.src = stream;
    }
    
    // Restore progress
    const storageKey = `progress_${animeId}_${episodeId}`;
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) video.currentTime = parseFloat(savedTime);
    
    video.play();
}

document.addEventListener('DOMContentLoaded', loadAnimeData);
