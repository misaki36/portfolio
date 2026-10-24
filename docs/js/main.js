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
const emptyMessage = document.querySelector('.works-empty');
// ↑ 「この種類の作品は、現在準備中です。」の文を探して、emptyMessage という名前で覚えておく

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
            let shownCount = 0;
            // ↑ 表示したカードの数を数える入れもの。はじめは 0 枚
            //   let は「あとで中身を変えられる」入れもの（const は変えられない）

            workItems.forEach((item) => {
                const category = item.dataset.category;
                // ↑ カードの data-category の中身（web など）を取り出す

                if (filter === 'all' || filter === category) {
                    item.hidden = false;
                    // ↑ 「すべて」が押されたとき、または種類が合っているときは表示する
                    shownCount++;
                    // ↑ 表示したので、1枚ふやす（++ は「1 足す」という意味）
                } else {
                    item.hidden = true;
                    // ↑ それ以外はかくす
                }
            });
            if (emptyMessage) {
                emptyMessage.hidden = shownCount > 0;
                // ↑ カードが1枚以上あれば かくす（true）、0枚なら 出す（false）
            }
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

// ==================================================
// 最初の手紙の演出：手紙が名刺カードになって飛んでいく
// ==================================================
const intro = document.querySelector('.intro');
const root = document.documentElement;

if (intro && root.classList.contains('is-intro')) {

    // 「このタブではもう見た」と記録する（来るたびに 1 回だけ出す）
    try {
        sessionStorage.setItem('introSeen', '1');
    } catch (e) { }

    const letter = intro.querySelector('.intro__letter');
    // ↑ 封筒から出てくる手紙
    const card = document.querySelector('.fv__card');
    // ↑ FV の本物の名刺カード（ここに向かって飛ぶ）

    let ended = false;
    // ↑ 演出が終わったかどうかの目印（2 回終わらないように）
    let flyingCard = null;
    // ↑ 飛んでいく名刺のコピー（あとで作る）

    // 演出を終わらせる（板とコピーを消して、本物の名刺を見せる）
    const endIntro = () => {
        if (ended) return;
        ended = true;
        root.classList.remove('is-intro');
        // ↑ これで本物の名刺が見えるようになる
        if (flyingCard) {
            flyingCard.remove();
            // ↑ コピーはもういらないので消す
        }
    };

    // 予備：今までどおり、全体をふわっと消す
    const fadeOutIntro = () => {
        intro.classList.add('is-hiding');
    };

    // 手紙を名刺のコピーに入れかえて、名刺の位置まで飛ばす
    const flyLetterToCard = () => {
        // 手紙・名刺がない、または animate() が使えないブラウザなら、予備の動きにする
        if (!letter || !card || !letter.animate) {
            fadeOutIntro();
            return;
        }

        // ① 手紙と本物の名刺の、画面の中での位置と大きさを測る
        const from = letter.getBoundingClientRect();
        const to = card.getBoundingClientRect();

        // 名刺が画面からはみ出しているときは、飛ばさずに予備の動きにする
        if (to.bottom > window.innerHeight || to.top < 0) {
            fadeOutIntro();
            return;
        }

        // ② 「名刺の大きさ」から見て、手紙は何倍か（たても横も同じ倍率にする → ゆがまない）
        const scale = from.width / to.width;
        // ③ 名刺のまん中から見て、手紙のまん中はどれだけずれているか
        const moveX = (from.left + from.width / 2) - (to.left + to.width / 2);
        const moveY = (from.top + from.height / 2) - (to.top + to.height / 2);

        // ④ 本物の名刺をコピーして、本物とまったく同じ場所・大きさに置く
        flyingCard = card.cloneNode(true);
        // ↑ cloneNode(true) は「中身ごとまるっとコピー」という意味
        flyingCard.classList.add('is-flying');
        flyingCard.setAttribute('aria-hidden', 'true');
        // ↑ 読み上げソフトには、コピーを読ませない
        flyingCard.style.left = `${to.left}px`;
        flyingCard.style.top = `${to.top}px`;
        flyingCard.style.width = `${to.width}px`;
        flyingCard.style.height = `${to.height}px`;
        document.body.appendChild(flyingCard);
        // ↑ ページに入れる

        // ⑤ 手紙はかくして、コピーと入れかえる
        letter.style.visibility = 'hidden';

        const duration = 1600;
        // ↑ 飛ぶ時間（1.6 秒）。好きな数字に変えてOK
        const easing = 'cubic-bezier(0.65, 0, 0.35, 1)';
        // ↑ ゆっくり動き出して、ゆっくり止まる動き方

        // ⑥ うしろの板の色をすき通らせる → サイトが見えてくる
        intro.animate(
            [
                { backgroundColor: getComputedStyle(intro).backgroundColor },
                { backgroundColor: 'transparent' }
            ],
            { duration, easing, fill: 'forwards' }
        );

        // ⑦ 封筒の本体・ふた・スキップボタンを消す
        intro.querySelectorAll('.intro__body, .intro__flap, .intro__skip').forEach((el) => {
            el.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: duration / 2, fill: 'forwards' }
            );
        });

        // ⑧ コピーを「手紙の場所・大きさ」から「本物の名刺の場所・大きさ」まで動かす
        const fly = flyingCard.animate(
            [
                { transform: `translate(${moveX}px, ${moveY}px) scale(${scale})` },
                // ↑ はじめ：手紙の場所に、手紙の大きさで
                { transform: 'none' }
                // ↑ おわり：本物の名刺の場所に、本物の大きさで
            ],
            { duration, easing, fill: 'forwards' }
        );

        // ⑨ 着いたら、本物の名刺と入れかえる
        fly.onfinish = () => {
            endIntro();
        };
    };

    // CSS の動きが終わったときに呼ばれる
    intro.addEventListener('animationend', (event) => {
        if (event.animationName === 'intro-letter') {
            flyLetterToCard();
            // ↑ 手紙が封筒から出きったら、飛ばす
        }
        if (event.animationName === 'intro-hide') {
            endIntro();
            // ↑ 予備の「ふわっと消える」が終わったら、演出を終わらせる
        }
    });

    // スキップボタン：すぐに演出を終わらせる
    const skipBtn = intro.querySelector('.intro__skip');
    if (skipBtn) {
        skipBtn.addEventListener('click', endIntro);
    }
}

// ==================================================
// スクロールでふわっと表示（全セクション共通のルール）
// 見出しが出る → 少しおくれて、中身がひとかたまりで出る
// ==================================================

// 「視差効果を減らす」がオンかどうか
const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// オンの人には何もしない（最初から全部見えている）
if (!prefersReduce && 'IntersectionObserver' in window) {

    // 各セクションの中身（.section の中の .inner のすぐ下にあるもの）を全部集める
    // :not(.works__slider) … WORKS のカードの列はもともと流れているので、仲間に入れない
    const fadeTargets = document.querySelectorAll('.section > .inner > :not(.works__slider)');

    // 見張り役を作る
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            // 画面に入ったら
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // ↑ 目印をつける → CSS でふわっと出る
                observer.unobserve(entry.target);
                // ↑ 一度出たら、もう見張らない
            }
        });
    }, {
        rootMargin: '0px 0px -10% 0px'
        // ↑ 画面の下から 10% 入ったところで動き始める
    });

    fadeTargets.forEach((target) => {
        target.classList.add('fade-in');
        // ↑ JS が動いたときだけ「出る前の状態」にする

        // 見出しでなければ（＝中身なら）、少しおくらせる
        if (!target.classList.contains('section-title')) {
            target.style.transitionDelay = '0.2s';
            // ↑ 見出しが出てから 0.2 秒あとに、中身が出る
        }

        fadeObserver.observe(target);
        // ↑ 見張りスタート
    });
}