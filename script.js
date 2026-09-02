let currentAnime = null;
let currentEpisode = 1;

async function loadAnimeData() {
  try {
    const response = await fetch('data/anime.json');
    const data = await response.json();
    currentAnime = data[0]; // For now, pick the first one
    renderEpisodeList(currentAnime);
    
    // Check for last watched
    const lastWatched = localStorage.getItem('last_watched_anime');
    if (lastWatched) {
        // Logic to restore state
    }
  } catch (error) {
    console.error('Error loading anime data:', error);
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
    localStorage.setItem('last_watched_anime', animeId);
    
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
