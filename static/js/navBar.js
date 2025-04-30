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