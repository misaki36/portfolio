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

// ==================================================
// 最初の手紙の演出：手紙が名刺カードの位置まで飛んでいく
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
    // ↑ FV の名刺カード（ここに向かって飛ぶ）

    let ended = false;
    // ↑ 演出が終わったかどうかの目印（2 回終わらないように）

    // 演出を終わらせる（板を消して、サイトを見せる）
    const endIntro = () => {
        if (ended) return;
        ended = true;
        root.classList.remove('is-intro');
    };

    // 予備：今までどおり、全体をふわっと消す
    const fadeOutIntro = () => {
        intro.classList.add('is-hiding');
    };

    // 手紙を名刺カードの位置まで飛ばす
    const flyLetterToCard = () => {
        // 手紙・名刺がない、または animate() が使えないブラウザなら、予備の動きにする
        if (!letter || !card || !letter.animate) {
            fadeOutIntro();
            return;
        }

        // ① 今の手紙と名刺カードの、画面の中での位置と大きさを測る
        const from = letter.getBoundingClientRect();
        const to = card.getBoundingClientRect();
        // 名刺カードが画面からはみ出しているときは、飛ばさずに予備の動きにする
        // （画面の外に飛んでいって、見えなくなるのをふせぐ）
        if (to.bottom > window.innerHeight || to.top < 0) {
            fadeOutIntro();
            return;
        }

        // ② どれだけ動かして、どれだけ大きくするかを計算する
        const moveX = (to.left + to.width / 2) - (from.left + from.width / 2);
        // ↑ 横に動く距離（まん中どうしの差）
        const moveY = (to.top + to.height / 2) - (from.top + from.height / 2);
        // ↑ たてに動く距離（まん中どうしの差）
        const scaleX = to.width / from.width;
        // ↑ 横に何倍にするか
        const scaleY = to.height / from.height;
        // ↑ たてに何倍にするか

        // 今の手紙の位置（封筒から少し上に出た状態）を受けつぐ
        const nowTransform = getComputedStyle(letter).transform;
        const start = nowTransform === 'none' ? '' : nowTransform;

        const duration = 1600;
        // ↑ 飛ぶ時間（1.6 秒）。数字を大きくするとゆっくり、小さくすると速くなる
        const easing = 'cubic-bezier(0.65, 0, 0.35, 1)';
        // ↑ ゆっくり動き出して、ゆっくり止まる動き方

        // 手紙をいちばん手前に出す（封筒の本体にかくれないように）
        letter.style.zIndex = '5';

        // ③-1 うしろの板の色を、すき通らせる → サイトが見えてくる
        intro.animate(
            [
                { backgroundColor: getComputedStyle(intro).backgroundColor },
                { backgroundColor: 'transparent' }
            ],
            { duration, easing, fill: 'forwards' }
        );

        // ③-2 封筒の本体・ふた・スキップボタンを消す
        intro.querySelectorAll('.intro__body, .intro__flap, .intro__skip').forEach((el) => {
            el.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: duration / 2, fill: 'forwards' }
            );
        });

        // ③-3 手紙の中の文字も消す（名刺の文字と入れかわるので）
        const letterText = letter.querySelector('.intro__letter-text');
        if (letterText) {
            letterText.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: duration / 2, fill: 'forwards' }
            );
        }

        // ③-4 手紙を名刺カードの位置・大きさまで動かす
        const fly = letter.animate(
            [
                { transform: start },
                { transform: `translate(${moveX}px, ${moveY}px) ${start} scale(${scaleX}, ${scaleY})` }
            ],
            { duration, easing, fill: 'forwards' }
        );

        // ④ 動き終わったら、演出を消して、名刺カードの中身をふわっと出す
        fly.onfinish = () => {
            if (ended) return;
            // ↑ スキップされていたら、何もしない
            endIntro();
            card.querySelectorAll(':scope > *').forEach((el) => {
                el.animate(
                    [{ opacity: 0 }, { opacity: 1 }],
                    { duration: 800, easing: 'ease' }
                    // ↑ 名刺の中身（封ろう・from・名前）がふわっと出る時間（0.8 秒）
                );
            });
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