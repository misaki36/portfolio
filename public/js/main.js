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



// ==================================================
// 制作実績一覧：タブで作品を絞り込む
// ==================================================

const filterButtons = document.querySelectorAll('.works-tabs__btn');
// ↑ タブのボタンを全部探して、filterButtons という名前で覚えておく
//   querySelectorAll は「当てはまるものを全部」探す（querySelector は「最初の1つだけ」）

const workItems = document.querySelectorAll('.works-grid > li');
// ↑ 作品カード（li）を全部探して、workItems という名前で覚えておく

if (filterButtons.length > 0) {
// ↑ 「タブが1つ以上あるページだけ、この中を動かす」
//   length は「見つかった数」。トップページなどタブがないページでは 0 になるので動かない

  filterButtons.forEach((button) => {
  // ↑ タブを1つずつ順番に処理する

    button.addEventListener('click', () => {
    // ↑ 「このタブがクリックされたら、中の処理をしてね」と登録する

      const filter = button.dataset.filter;
      // ↑ 押されたタブの data-filter の中身（all / web / lp / banner / flyer）を取り出す
      //   HTMLの data-〇〇 は、JavaScriptでは dataset.〇〇 で読める

      // ----- タブの見た目を切りかえる -----
      filterButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      // ↑ いったん全部のタブから「選ばれている」目印を外す

      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
      // ↑ 押されたタブにだけ「選ばれている」目印をつける

      // ----- 作品を表示・かくす -----
      workItems.forEach((item) => {
        const category = item.dataset.category;
        // ↑ カードの data-category の中身（web など）を取り出す

        if (filter === 'all' || filter === category) {
          item.hidden = false;
          // ↑ 「すべて」が押されたとき、または種類が合っているときは表示する
        } else {
          item.hidden = true;
          // ↑ それ以外はかくす
        }
      });
    });
  });
}