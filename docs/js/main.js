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

// 作品詳細：今読んでいる所の目次を茶色にする
const tocLinks = document.querySelectorAll('.detail-toc__link'); // 目次のリンク全部
const detailBlocks = document.querySelectorAll('.detail__block'); // 本文のまとまり全部

// 目次があるページ（work-detail.html）だけで動かす
if (tocLinks.length > 0) {
    // 「見張り役」を作る：本文のまとまりが、画面の決めた所に来たら知らせてくれる
    const observer = new IntersectionObserver((entries) => {
        // entries ＝ 見張り役からの「お知らせ」のリスト
        entries.forEach((entry) => {
            // まとまりが、決めた所に入ってきたときだけ動く
            if (entry.isIntersecting) {
                const id = entry.target.id; // 入ってきたまとまりの id（例：structure）

                // 目次のリンクを1つずつ見ていく
                tocLinks.forEach((link) => {
                    // リンクの href が「# ＋ id」と同じなら、そのリンクを茶色にする
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('is-active');
                        link.setAttribute('aria-current', 'true'); // 読み上げソフトにも「ここが今の場所」と伝える
                    } else {
                        link.classList.remove('is-active');
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, {
        // 画面の「上から40%〜45%」の細い帯に入ったら、お知らせする
        rootMargin: '-40% 0px -55% 0px'
    });

    // 本文のまとまりを1つずつ、見張り役に見張ってもらう
    detailBlocks.forEach((block) => {
        observer.observe(block);
    });
}

// スマホ：メニューの開け閉め
const header = document.querySelector('.header');
const menuBtn = document.querySelector('.header__menu-btn');

if (header && menuBtn) {
    // ≡ ボタンを押したとき
    menuBtn.addEventListener('click', () => {
        // toggle = 付いていなければ付ける・付いていれば外す。付けたら true が返ってくる
        const isOpen = header.classList.toggle('is-open');
        // 読み上げソフト向けに、今の状態とボタンの名前を変える
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });

    // メニューの中のリンクを押したら閉じる（同じページの #flow に飛んだときに、開いたままにならないように）
    header.querySelectorAll('.header__nav a').forEach((link) => {
        link.addEventListener('click', () => {
            header.classList.remove('is-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'メニューを開く');
        });
    });
}