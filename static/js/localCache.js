/**
 * 
 * @param {string} key 
 * @returns 
 */
function getDataFromCache(key){
  return sessionStorage.getItem(key);
}

/**
 * 
 * @param {string} key 
 * @param {string} value 
 * @returns 
 */
function checkCacheDataFormat(key, value){
  if (typeof key !== 'string') return false;
  if (typeof value !== 'string') return false;
  if (!key.trim()) return false;
  if (!value.trim()) return false;

  return true;
}

/**
 * 
 * @param {string} key 
 * @param {string} value 
 * @returns 
 */
function insertDataInCache(key, value){
  if (!checkCacheDataFormat(key, value)) return;

  sessionStorage.setItem(key, value);
}

export { getDataFromCache, insertDataInCache, };