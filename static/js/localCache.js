function getDataFromCache(key){
    return sessionStorage.getItem(key);
}

function checkCacheDataFormat(key, value){
    if (typeof key !== 'string') return false;
    if (typeof value !== 'string') return false;
    if (!key.trim()) return false;
    if (!value.trim()) return false;

    return true;
}

function insertDataInCache(key, value){
    if (!checkCacheDataFormat(key, value)) return;

    sessionStorage.setItem(key, value);
}

export { getDataFromCache, insertDataInCache, };