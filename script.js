const API = `https://kitsu.io/api/edge`;
const banner = document.querySelector(`.banner`);
const trending = document.querySelector(`.trending`);
let bannerIndex = 1;

// function to fetch trending anime
async function getTrending() {
    const response = await fetch(`${API}/trending/anime`);
    const data = await response.json();
    trending.innerHTML = generateTrendingHTML(data.data);
    banner.innerHTML = generateBannerHTML(data.data);
    initBannerConrols();
}

getTrending();

// function to generate banner
function generateBannerHTML(data) {
    console.log(data)
    let html = `<ol>`;
    data.forEach((item, i) => {
        const d = item.attributes;
        const c = i == 0 ? 'active' : ( i == data.length - 1 ? 'prev' : 'next');
        const description = d.synopsis.substring(0, 200);
        html += `
            <li class="banner-item ${c}" style="background-image: url('${d.coverImage.original}');">
                <div class="banner-item-detail-container">
                    <div class="banner-item-details">
                        <h1>${d.canonicalTitle}</h1>
                        <div class="meta">
                            <span><i class="fa fa-play-circle"></i> ${d.showType}</span>
                            <span><i class="fa fa-calendar"></i> ${d.startDate}</span>
                            <span><i class="fa fa-hourglass-start"></i> ${d.episodeLength}m</div>
                        <div class="dec">${description}...</div>
                        <div class="action">
                            <a href="https://www.youtube.com/watch?v=${d.youtubeVideoId}&mode=theatre" class="btn-watch" target="_blank"><i class="fa fa-play-circle"></i> Watch Trailer</a>
                        </div>
                    </div>
                </div>
            </li>
        ` 
    });
    html += `</ol>`;
    html += `<div class="controls">
                <span class="prev" data-val="-1"><i class="fa fa-chevron-left"></i></span>
                <span class="next" data-val="1"><i class="fa fa-chevron-right"></i></span>
            </div>
    `;
    return html;
}

// function to generate trending anime
function generateTrendingHTML(data) {
    let html = ``;
    data.forEach((item) => {
        const d = item.attributes;
        html += `
            <article class="trending-item">
                <figure>
                    <img src="${d.posterImage.tiny}" />
                </figure>
                <div class="trending-details">
                    <span class="title">${d.canonicalTitle}</span>
                </div>
            </article>
        ` 
    });
    return html;
}
function getCorrectBannerIndex(index) {
    const bannerItems = banner.querySelectorAll(`.banner-item`);
    if( index > bannerItems.length ) {
        return  1;
    } else if( index < 1 ) {
        return bannerItems.length;
    }
    return index; 
}
function initBannerConrols() {
    const bannerItems = banner.querySelectorAll(`.banner-item`);
    const updateBanner = (val) => {
        bannerItems.forEach(b => {
            b.classList.remove('active', 'prev', 'next');
        });
        bannerIndex = getCorrectBannerIndex(val);
        prev = getCorrectBannerIndex(bannerIndex-1);
        next = getCorrectBannerIndex(bannerIndex+1);
        banner.querySelector(`.banner-item:nth-of-type(${bannerIndex})`).classList.add('active');
        banner.querySelector(`.banner-item:nth-of-type(${prev})`).classList.add('prev');
        banner.querySelector(`.banner-item:nth-of-type(${next})`).classList.add('next');

    };
    const controls = document.querySelectorAll(`.controls span`);
    controls.forEach(function(item) {
        item.addEventListener('click', function() {
            const val = bannerIndex + parseInt(item.dataset.val);
            updateBanner(val);
        });
    });
    // automated
    setInterval(() => {
        // bannerIndex++;
        // updateBanner(bannerIndex);
    }, 5000);
}

window.addEventListener('scroll', () => {
    const body = document.querySelector('body')
    if( window.scrollY > 0 ) {
        body.classList.add('scroll');
    } else {
        body.classList.remove('scroll');
    }
});

const home = document.querySelector('.home');
const searchTerm = document.querySelector('.searchTerm');
const searchButton = document.querySelector('.searchButton');
const searchResult = document.querySelector(`.search-result`);

searchButton.addEventListener('click', function() {
    home.classList.add('hide');
    searchResult.classList.remove('hide');
    searchResult.querySelector('.list').innerHTML = 'Loading...'
    const text  = searchTerm.value;
    search(`${API}/anime?filter[text]=${text}`);
});

async function search(url) {
    const response = await fetch(url);
    const data = await response.json();
    searchResult.querySelector('.list').innerHTML = generateSearchHTML(data.data); 
    searchResult.querySelector('.page').innerHTML = generatePagination(data.links);
}


function generateSearchHTML(data) {
    let html = ``;
    data.forEach((item) => {
        const d = item.attributes;
        html += `
            <article class="search-item">
                <figure>
                    <img src="${d.posterImage.medium}" />
                </figure>
                <div class="search-details">
                    <span class="title">${d.canonicalTitle}</span>
                </div>
            </article>
        ` 
    });
    return html;
}

function generatePagination(links) {
    let html = `
        <a href="javascript: search('${links.first}');">First</a>
        <a href="javascript: search('${links.last}');">Last</a>
        <a href="javascript: search('${links.next}');">Next</a>
    `;
    return html;
}
