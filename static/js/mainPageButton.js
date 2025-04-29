import { getVideoList, filterVideosByTag } from "./mainPage.js";

function scrollCategory(direction) {
    const container = document.getElementById("category-scroll");
    const scrollAmount = 300; // 한 번에 스크롤할 px

    if (direction === "right") {
      container.scrollBy({ left: scrollAmount, behavior: "smooth"});
    } else if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth"});
    }
}

async function addTags() {
    try{
        const {data: res} = await getVideoList();
        const container = document.getElementById("category-scroll");
    
        const tagSet = new Set();
    
        // 중복 제거
        res.forEach(video => {
            video.tags.forEach(tag => tagSet.add(tag.trim()));
        });

        const tags = ["All", ...tagSet];

        // 현재 있는 article 요소들
        let articles = container.querySelectorAll(".content");

        // tags 보다 article이 부족하면 article + div를 새로 만들어서 추가
        while(articles.length < tags.length) {
            const article = document.createElement("article");
            article.className = "content";
            
            const div = document.createElement("div");
            article.appendChild(div);
            container.appendChild(article);

            articles = container.querySelectorAll(".content"); // article 최신화
        }
        
        // tags 개수만큼 article 채워넣기
        tags.forEach((tag, index) => {
            const article = articles[index];
            const div = article.querySelector("div");

            if (div) {
                div.textContent = tag;
                div.dataset.tag = tag;
    
                div.onclick = () => {
                    filterVideosByTag(tag);
                    // updateActiveTag(div);
                }
            }
        });

    } catch (error) {
        console.error("태그 생성 실패:", error);
    }

    // 클릭된 태그 활성화 표시
    // updateActiveTag()

}

addTags();

