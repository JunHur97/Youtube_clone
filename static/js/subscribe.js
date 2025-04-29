function subscribe(chId){
    const subList = JSON.parse(localStorage.getItem('subList'));
    if (subList.includes(chId)) return unsubscribe(chId);

    subList.push(chId);
    localStorage.setItem('subList', JSON.stringify(subList));

    // navBar.js/insertNavbarSub()
    insertNavbarSub(chId);
}

function unsubscribe(chId){
    let subList = JSON.parse(localStorage.getItem('subList'));
    if (!subList.includes(chId)) return subscribe(chId);

    subList = subList.filter(v => v !== chId);
    localStorage.setItem('subList', JSON.stringify(subList));

    // navBar.js/removeNavbarSub()
    removeNavbarSub(chId);
}

function onSubBtnClick(e){
    const subBtn = e.target;
    const chId = parseInt(subBtn.getAttribute('chId'), 10);

    if (subBtn.hasAttribute('subscribed')){
        unsubscribe(chId);
        subBtn.innerText = 'SUBSCRIBES';
        subBtn.removeAttribute('subscribed');
    }else {
        subscribe(chId);
        subBtn.innerText = 'SUBSCRIBED';
        subBtn.setAttribute('subscribed', '');
    }
}

// localStorage.subList init
$(document).ready(() => {
    if (!localStorage.getItem('subList')){
        // localStorage.clear();
        localStorage.setItem('subList', JSON.stringify([]));
    
        subscribe(1);
        // subscribe(2);
        subscribe(3);
    }
})