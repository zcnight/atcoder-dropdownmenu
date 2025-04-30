// コンテスト名を取得
const contestName = location.pathname.split("/")[2];

class Problem {
  constructor(id, name, url) {
    this.id = id;
    this.name = name;
    this.url = url;
  }
}

function getProblemData(trElem) {
  const tableData = trElem.querySelectorAll("td");
  
  // 必要な情報を格納
  const probId = tableData[0].firstChild.textContent;
  const probUrl = tableData[0].firstChild.href;
  const probName = tableData[1].firstChild.textContent;
  
  return new Problem(probId, probName, probUrl);
}

async function fetchData() {
  try {
    // 問題ページをフェッチ
    const response = await fetch(`https://atcoder.jp/contests/${contestName}/tasks`);
    const res = await response.text();

    // 取得したテキストをDOMに変換
    const doc = new DOMParser().parseFromString(res, "text/html");

    // tbodyの子要素をすべて取得
    const tableRow = doc.querySelector("tbody").children;

    // 各問題の情報を配列に格納
    const vec = [];
    for (const tr of tableRow) {
      vec.push(getProblemData(tr));
    }
    
    // 問題タブの要素を取得
    const probTab = document.getElementsByClassName("nav nav-tabs")[0].children[1];

    const ulElem = document.createElement("ul");
    ulElem.setAttribute("class", "dropdown-menu");

    // ドロップダウンメニューの項目を作成
    for (const v of vec) {
      const liElem = document.createElement("li");
      const aElem = document.createElement("a");
      aElem.setAttribute("href", v.url);
      aElem.textContent = `${v.id} - ${v.name}`;
      liElem.appendChild(aElem);
      ulElem.appendChild(liElem);
    }

    // 問題タブにメニューを追加
    probTab.appendChild(ulElem);

    // 問題タブ上にマウスがあるときにドロップダウンメニューを有効化する
    probTab.addEventListener("mouseover", () => probTab.setAttribute("class", "open"));
    probTab.addEventListener("mouseout", () => probTab.removeAttribute("class"));
  } catch (error) {
    console.log(error);
  }
}

fetchData();
