'use strict';
// ↑ 「きびしいルールでチェックしてね」という合図。書きまちがいをエラーで教えてくれるようになる


// ==================================================
// WORKS：カードを無限に流す
// ==================================================

const worksList = document.querySelector('.works__list');
// ↑ HTMLの中から class="works__list" の箱を探して、worksList という名前で覚えておく

if (worksList) {
// ↑ 「works__list があるページだけ、この中を動かす」
//   ほかのページ（works__list がないページ）でエラーにならないようにするため

  const cards = Array.from(worksList.children);
  // ↑ works__list の中のカード（li）を、全部まとめて取り出す

  cards.forEach((card) => {
  // ↑ 取り出したカードを、1枚ずつ順番に処理する

    const clone = card.cloneNode(true);
    // ↑ カードを中身ごと丸ごとコピーする（true は「中身も全部」という意味）

    clone.setAttribute('aria-hidden', 'true');
    // ↑ コピーは見た目のためだけのものなので、読み上げソフトには読ませない
    //   （同じ作品が2回読み上げられないようにする）

    clone.querySelectorAll('a').forEach((link) => {
      link.setAttribute('tabindex', '-1');
    });
    // ↑ コピーの中のリンクは、Tabキーで選べないようにする
    //   （キーボードで操作する人が、同じリンクに2回止まらないようにする）

    worksList.appendChild(clone);
    // ↑ コピーしたカードを、リストのいちばん後ろに追加する
  });
}