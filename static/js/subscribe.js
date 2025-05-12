import { getDataFromCache, insertDataInCache } from './localCache.js';

/**
 * 
 * @param {string} chId 
 * @returns 
 */
function subscribe(chId){
  const subList = JSON.parse(getDataFromCache('subList'));
  if (subList.includes(chId)) return unsubscribe(chId);

  subList.push(chId);
  insertDataInCache('subList', JSON.stringify(subList));

  const subEvent = new CustomEvent('subscribe', { detail: { chId, } });
  $('section.subscription')[0].dispatchEvent(subEvent);
}

/**
 * 
 * @param {string} chId 
 * @returns 
 */
function unsubscribe(chId){
  let subList = JSON.parse(getDataFromCache('subList'));
  if (!subList.includes(chId)) return subscribe(chId);

  subList = subList.filter(v => v !== chId);
  insertDataInCache('subList', JSON.stringify(subList));

  const unsubEvent = new CustomEvent('unsubscribe', { detail: { chId, } });
  $('section.subscription')[0].dispatchEvent(unsubEvent);
}

/**
 * 
 * @param {Event} e 
 * @returns 
 */
function onSubBtnClick(e){
  const subBtn = e.target;
  const chId = parseInt(subBtn.getAttribute('chId'), 10);

  if (!chId) return;

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

// sessionStorage.subList init
$(document).ready(() => {
  if (!sessionStorage.getItem('subList')){
    // sessionStorage.clear();

    const subList = [];

    // subList.push(1);
    // subList.push(3);

    insertDataInCache('subList', JSON.stringify(subList));
  }
});

export { onSubBtnClick, };