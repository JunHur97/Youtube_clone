function insertNavbarSub(chId){
    const hos = `
    <div class="navItem" chId=${chId}>
        <img src="https://storage.googleapis.com/youtube-clone-video/channel_profile_${chId}.png" />
        <p>Skylar Dias</p>
    </div>`;

    $('section.subscription')[0].insertAdjacentHTML('beforeend', hos);
}

function removeNavbarSub(chId){
    const sub = $(`section.subscription > .navItem[chid=${chId}]`)[0];

    sub.remove();
}