const banner = document.querySelector(`.banner`);
const trending = document.querySelector(`.trending`);
let bannerIndex = 1;
async function getTrending() {
    const response = await fetch(`https://kitsu.io/api/edge/trending/anime`);
    const data = await response.json();
    trending.innerHTML = generateTrendingHTML(data.data);
    banner.innerHTML = generateBannerHTML(data.data);
    initBannerConrols();
}

getTrending();

function generateBannerHTML(data) {
    console.log(data)
    let html = `<ol>`;
    data.forEach((item, i) => {
        const d = item.attributes;
        const c = i == 0 ? 'active' : '';
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
                            <button class="btn-watch"><i class="fa fa-play-circle"></i>Watch Now</button>
                        </div>
                    </div>
                </div>
            </li>
        ` 
    });
    html += `</ol>`;
    html += `<div class="controls"><span class="prev" data-val="-1"></span><span class="next" data-val="1"></span></div>`;
    return html;
}

function generateTrendingHTML(data) {
    let html = ``;
    data.forEach((item) => {
        const d = item.attributes;
        html += `
            <article class="trending-item">
                <figure>
                    <img src="${d.posterImage.tiny}" />
                </figure>
            </article>
        ` 
    });
    return html;
}

function initBannerConrols() {
    const bannerItems = banner.querySelectorAll(`.banner-item`);
    const updateBanner = (val) => {
        bannerItems.forEach(b => {
            b.classList.remove('active');
        });
        bannerIndex += parseInt(val);
        if( bannerIndex > bannerItems.length ) {
            bannerIndex = 1;
        } else if( bannerIndex < 1 ) {
            bannerIndex = bannerItems.length;
        }
        banner.querySelector(`.banner-item:nth-of-type(${bannerIndex})`).classList.add('active');

    };
    const controls = document.querySelectorAll(`.controls span`);
    controls.forEach(function(item) {
        item.addEventListener('click', function() {
            const val = item.dataset.val;
            updateBanner(val);
        });
    });
    // automated
    setInterval(() => {
        bannerIndex++;
        updateBanner(bannerIndex);
    }, 5000);
}
