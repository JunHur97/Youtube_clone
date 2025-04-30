document.addEventListener('DOMContentLoaded', () => {
  // 설명 토글 버튼과 전체 설명 텍스트 영역 가져오기
  const toggleBtn = document.getElementById('toggleDescription');
  const fullText = document.getElementById('fullDescription');
  // 두 요소가 모두 존재할때만 이벤트 바인딩
  if (toggleBtn && fullText) {
    toggleBtn.addEventListener('click', () => {
      // hidden 클래스를 토글 (보이기/숨기기)
      fullText.classList.toggle('hidden');
      // 버튼 텍스트 변경
      toggleBtn.textContent = fullText.classList.contains('hidden') ? 'SHOW MORE' : 'SHOW LESS';
    });
  }
});

//subscribe.js에서 사용하는 sessionStorage 저장 함수
function insertDataInCache(key, value) {
  sessionStorage.setItem(key, value);
}
//subscribe.js에서 사용하는 sessionStorage 읽기 함수
function getDataFromCache(key) {
  return sessionStorage.getItem(key);
}