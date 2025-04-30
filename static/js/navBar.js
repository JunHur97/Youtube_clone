import { getDataFromCache } from './localCache.js';
import { getChannel } from './modules/axiosReq.js';

async function insertNavbarSub(chId){
    const { channel_name } = await getChannel(chId);

    const hos = `
    <a href="/channels?ch_id=${chId}">
        <div class="navItem" chId=${chId}>
            <img src="https://storage.googleapis.com/youtube-clone-video/channel_profile_${chId}.png" />
            <p>${channel_name}</p>
        </div>
    </a>`;

    $('section.subscription')[0].insertAdjacentHTML('beforeend', hos);
}

function removeNavbarSub(chId){
    const sub = $(`section.subscription .navItem[chid=${chId}]`)[0];

    sub.remove();
}

function subHandler(e){
    const { chId } = e.detail;

    if (chId !== 0 && !chId) return;

    insertNavbarSub(chId);
}

function unsubHandler(e){
    const { chId } = e.detail;

    if (chId !== 0 && !chId) return;

    removeNavbarSub(chId);
}

$(document).ready(() => {
    const subSection = $('section.subscription')[0];
    const subList = getDataFromCache('subList');

    if (!!subList) JSON.parse(subList).forEach(v => { insertNavbarSub(v); });

    subSection.addEventListener('subscribe', subHandler);
    subSection.addEventListener('unsubscribe', unsubHandler);
});

export { insertNavbarSub, removeNavbarSub, };