<?php

declare(strict_types=1);

// 道具箱（public の外）を読み込む
// __DIR__ は「このファイルがあるフォルダ」。そこから1つ上（..）の app/functions.php
require_once __DIR__ . '/../app/functions.php';

start_session();

// 合言葉を用意する
$token = csrf_token();

// send.php から戻ってきたときの「エラー」と「入力していた内容」を受け取る
// ?? [] は「なければ空っぽにする」という意味
$errors = $_SESSION['errors'] ?? [];
$old    = $_SESSION['old'] ?? [];

// 一度表示したら消す（再読み込みしたら、エラーが消えるように）
unset($_SESSION['errors'], $_SESSION['old']);
?>
<!DOCTYPE html>
<!-- ↑ 「このファイルはHTMLで書いてあるよ」とブラウザに伝える合図。必ず1行目に書く -->

<html lang="ja">
<!-- ↑ ページ全体を包む箱。lang="ja" は「日本語のページです」という意味（読み上げソフトや検索エンジンが使う） -->

<head>
    <!-- ↑ 画面には出ない「ページの設定」を書く場所 -->

    <meta charset="UTF-8">
    <!-- ↑ 文字の種類の指定。これがないと日本語が文字化けすることがある -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- ↑ スマホで見たときに、画面の幅に合わせて表示する設定 -->


    <title>料金・お問い合わせ | Kuwamoto Misaki</title>

    <meta name="description" content="Webデザイナー桑本美咲へのご依頼の流れ・料金の目安・お問い合わせフォームです。制作のご相談だけでもお気軽にどうぞ。">

    <!-- ↑ 検索結果のタイトルの下に出る説明文 -->

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- ↑ 「このあとGoogleのフォントを使うから、先に接続の準備をしておいて」という合図。表示が少し速くなる -->

    <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Shippori+Mincho:wght@400;500&family=Zen+Kaku+Gothic+New:wght@400;500&display=swap"
        rel="stylesheet">
    <!-- ↑ Figmaで使った3つのフォントを読み込む。wght@400;500 は「Regular と Medium の太さだけ使う」という意味（使う太さだけにすると軽くなる） -->

    <link rel="stylesheet" href="css/style.css">
    <!-- ↑ 自分で書くCSSファイルを読み込む。フォントのあとに書くのがポイント -->
</head>

<body>
    <!-- ↑ 画面に表示されるものを書く場所 -->

    <!-- ==================== ヘッダー ==================== -->
    <header class="header">
        <!-- ↑ header は「ページの頭の部分」という意味のタグ -->

        <div class="header__inner inner">
            <!-- ↑ class を2つつけている。header__inner（ヘッダー用の設定）と inner（幅をそろえる共通パーツ） -->

            <a class="header__logo" href="index.html">
                <!-- ↑ ロゴを押すとトップページに戻るリンク -->
                <img src="images/logo-seal.svg" alt="Kuwamoto Misaki トップページへ" width="56" height="56">
                <!-- ↑ alt は画像が見えない人（読み上げソフト）向けの説明。
                 width と height を書いておくと、画像を読み込む前から場所が確保されて、ページがガタッとずれない -->
            </a>

            <button class="header__menu-btn" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="global-nav">
                <!-- ↑ スマホのときだけ出る ≡ ボタン。aria-controls で「global-nav を開け閉めするボタン」と読み上げソフトに伝える -->
                <span class="header__menu-line"></span><span class="header__menu-line"></span><span class="header__menu-line"></span>
            </button>

            <nav class="header__nav" id="global-nav" aria-label="メインメニュー">
                <!-- ↑ nav は「メニュー」という意味のタグ。aria-label で読み上げソフトに名前を伝える -->

                <ul class="header__list">
                    <!-- ↑ メニューの並び（ul = 順番のないリスト） -->
                    <li>
                        <a class="header__link" href="works.html">
                            <span class="header__link-en">works</span>
                            <span class="header__link-ja">制作実績</span>
                        </a>
                    </li>
                    <li>
                        <a class="header__link" href="about.html">
                            <span class="header__link-en">about me</span>
                            <span class="header__link-ja">私について</span>
                        </a>
                    </li>
                    <li>
                        <a class="header__link" href="contact.php#flow">
                            <!-- ↑ #flow は「contact.php の中の flow という場所まで飛ぶ」という意味 -->
                            <span class="header__link-en">flow</span>
                            <span class="header__link-ja">ご依頼の流れ</span>
                        </a>
                    </li>
                </ul>
                <!-- ↑ ここで ul を閉じる。お問い合わせボタンは ul の外（nav の中） -->

                <a class="header__contact" href="contact.php#contact" aria-current="page">
                    <!-- ↑ お問い合わせボタン。このページなので aria-current="page" をつける -->
                    <span class="header__contact-en">contact</span>
                    <span class="header__contact-ja">お問い合わせ</span>
                </a>

            </nav>
        </div>
    </header>

    <!-- ==================== メイン（ページの中身） ==================== -->
    <main>
        <!-- このページの名前。画面には出さないけど、読み上げソフトや Google には伝わる -->
        <h1 class="visually-hidden">料金・お問い合わせ</h1>
        <!-- ========== FLOW ========== -->
        <section class="flow section" id="flow">

            <div class="inner">

                <h2 class="section-title">
                    <span class="section-title__en">FLOW</span>
                    <span class="section-title__ja">ご依頼の流れ</span>
                </h2>

                <ol class="flow__list">
                    <!-- ↑ ol は「順番のあるリスト」。ul（順番なし）とちがって、1→2→3…と順番に意味があるときに使う -->

                    <li class="flow__item">
                        <span class="flow__num">01</span>
                        <h3 class="flow__title">お問い合わせ</h3>
                        <p class="flow__text">フォームから<br>お気軽にどうぞ</p>
                    </li>

                    <li class="flow__item">
                        <span class="flow__num">02</span>
                        <h3 class="flow__title">ヒアリング</h3>
                        <p class="flow__text">ご要望やイメージを<br>うかがいます</p>
                    </li>

                    <li class="flow__item">
                        <span class="flow__num">03</span>
                        <h3 class="flow__title">お見積もり・ご契約</h3>
                        <p class="flow__text">内容と金額を<br>ご確認いただきます</p>
                    </li>

                    <li class="flow__item">
                        <span class="flow__num">04</span>
                        <h3 class="flow__title">制作</h3>
                        <p class="flow__text">デザインから実装まで<br>進めます</p>
                    </li>

                    <li class="flow__item">
                        <span class="flow__num">05</span>
                        <h3 class="flow__title">修正・納品</h3>
                        <p class="flow__text">ご確認後、公開まで<br>お手伝いします</p>
                    </li>

                </ol>

            </div>

        </section>

        <!-- ========== PRICE と WORKING（横に並べる） ========== -->
        <section class="price-working section">
            <!-- ↓ section の1段内側 -->
            <div class="inner">
                <!-- ↓ div.inner の1段内側：2つを横に並べる箱 -->
                <div class="price-working__grid">
                    <!-- ↓ div.price-working__grid の1段内側 -->

                    <!-- 左：PRICE（id="price" はトップの「料金を見る」から飛んでくる目印） -->
                    <div class="price" id="price">
                        <!-- ↓ div.price の1段内側 -->
                        <h2 class="section-title">
                            <span class="section-title__en">PRICE</span>
                            <span class="section-title__ja">料金の目安</span>
                        </h2>

                        <table class="price__table">
                            <tbody>
                                <tr>
                                    <th class="price__name" scope="row">LP制作</th>
                                    <td class="price__desc">1ページ・デザインから公開まで</td>
                                    <td class="price__cost">〇〇円〜</td>
                                </tr>
                                <tr>
                                    <th class="price__name" scope="row">ホームページ制作</th>
                                    <td class="price__desc">5ページ程度・デザインから公開まで</td>
                                    <td class="price__cost">〇〇円〜</td>
                                </tr>
                                <tr>
                                    <th class="price__name" scope="row">バナー制作</th>
                                    <td class="price__desc">SNS・Web広告用</td>
                                    <td class="price__cost">〇〇円〜</td>
                                </tr>
                                <tr>
                                    <th class="price__name" scope="row">チラシ・POP制作</th>
                                    <td class="price__desc">A4片面・印刷データまで</td>
                                    <td class="price__cost">〇〇円〜</td>
                                </tr>
                                <tr>
                                    <th class="price__name" scope="row">更新・修正</th>
                                    <td class="price__desc">公開後の文章・画像の差し替えなど</td>
                                    <td class="price__cost">〇〇円〜</td>
                                </tr>
                            </tbody>
                        </table>

                        <p class="price__note">※ 料金は目安です。内容をうかがったうえで、お見積もりをお出しします。</p>
                    </div>

                    <!-- 右：WORKING -->
                    <div class="working">
                        <!-- ↓ div.working の1段内側 -->
                        <h2 class="section-title">
                            <span class="section-title__en">WORKING</span>
                            <span class="section-title__ja">稼働条件</span>
                        </h2>

                        <dl class="profile__info">
                            <div class="profile__info-row">
                                <dt class="profile__info-term">稼働時間</dt>
                                <dd class="profile__info-desc">平日 10:00〜14:00</dd>
                            </div>
                            <div class="profile__info-row">
                                <dt class="profile__info-term">ご返信</dt>
                                <dd class="profile__info-desc">土日祝を除き24時間以内</dd>
                            </div>
                            <div class="profile__info-row">
                                <dt class="profile__info-term">ご連絡方法</dt>
                                <dd class="profile__info-desc">メール・Discord</dd>
                            </div>
                            <div class="profile__info-row">
                                <dt class="profile__info-term">納期の目安</dt>
                                <dd class="profile__info-desc">LP：約〇週間〜</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========== CONTACT ========== -->
        <section class="contact section" id="contact">
            <!-- ↓ section の1段内側 -->
            <div class="inner">
                <!-- ↓ div.inner の1段内側 -->

                <h2 class="section-title">
                    <span class="section-title__en">CONTACT</span>
                    <span class="section-title__ja">お問い合わせ</span>
                </h2>

                <p class="contact__lead">制作のご依頼・ご相談など、お気軽にお問い合わせください。</p>

                <!-- action="send.php"：送り先。method="post"：中身を見えない形で送る -->
                <form class="contact-form" action="send.php" method="post">
                    <!-- ↓ form の1段内側 -->

                    <!-- エラーがあるときだけ、上にまとめのメッセージを出す
                    role="alert" で、読み上げソフトにもすぐ伝わる -->
                    <?php if ($errors): ?>
                        <p class="contact-form__alert" role="alert">入力内容をご確認ください。</p>
                    <?php endif; ?>

                    <!-- 合言葉（画面には出ない）。送信するときに一緒に送られる -->
                    <input type="hidden" name="csrf_token" value="<?= h($token) ?>">

                    <div class="contact-form__item">
                        <label class="contact-form__label" for="name">
                            お名前<span class="contact-form__required" aria-hidden="true">*</span>
                        </label>
                        <!-- value に前回入力した内容を入れる（エラーで戻ったとき、書き直さなくていいように）
                             ユーザーの入力なので、必ず h() を通す -->
                        <input class="contact-form__input" type="text" id="name" name="name" autocomplete="name" maxlength="50" required value="<?= h($old['name'] ?? '') ?>">
                        <?php if (isset($errors['name'])): ?>
                            <p class="contact-form__error"><?= h($errors['name']) ?></p>
                        <?php endif; ?>
                    </div>

                    <div class="contact-form__item">
                        <label class="contact-form__label" for="company">会社名・団体名（任意）</label>
                        <input class="contact-form__input" type="text" id="company" name="company" autocomplete="organization" maxlength="100" value="<?= h($old['company'] ?? '') ?>">
                        <?php if (isset($errors['company'])): ?>
                            <p class="contact-form__error"><?= h($errors['company']) ?></p>
                        <?php endif; ?>
                    </div>

                    <div class="contact-form__item">
                        <label class="contact-form__label" for="email">
                            メールアドレス<span class="contact-form__required" aria-hidden="true">*</span>
                        </label>
                        <input class="contact-form__input" type="email" id="email" name="email" autocomplete="email" maxlength="254" required value="<?= h($old['email'] ?? '') ?>">
                        <?php if (isset($errors['email'])): ?>
                            <p class="contact-form__error"><?= h($errors['email']) ?></p>
                        <?php endif; ?>
                    </div>

                    <div class="contact-form__item">
                        <label class="contact-form__label" for="message">
                            ご相談内容<span class="contact-form__required" aria-hidden="true">*</span>
                        </label>
                        <!-- textarea は開くタグと閉じるタグの間が中身。間に空白や改行を入れないように -->
                        <textarea class="contact-form__textarea" id="message" name="message" rows="8" maxlength="2000" required><?= h($old['message'] ?? '') ?></textarea>
                        <?php if (isset($errors['message'])): ?>
                            <p class="contact-form__error"><?= h($errors['message']) ?></p>
                        <?php endif; ?>
                    </div>

                    <div class="contact-form__agree">
                        <label>
                            <input type="checkbox" name="agree" value="1" required <?= !empty($old['agree']) ? 'checked' : '' ?>>
                            <a href="privacy.html" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>に同意する
                        </label>
                        <?php if (isset($errors['agree'])): ?>
                            <p class="contact-form__error"><?= h($errors['agree']) ?></p>
                        <?php endif; ?>
                    </div>

                    <div class="contact-form__submit">
                        <button class="btn btn--main" type="submit">送信する</button>
                    </div>
                </form>

            </div>
        </section>
    </main>

    <!-- ==================== フッター ==================== -->
    <footer class="footer">
        <!-- ↑ footer は「ページの終わりの部分」という意味のタグ -->

        <div class="footer__inner inner">

            <!-- ===== 上の段：ロゴと名前／メニュー ===== -->
            <div class="footer__top">

                <a class="footer__brand" href="index.html">
                    <img src="images/logo-seal.svg" alt="" width="56" height="56">
                    <!-- ↑ alt="" （空っぽ）にしているのは、すぐ横に名前の文字があるから。
                   読み上げソフトが「ロゴ、Kuwamoto Misaki」と2回読まないようにするため -->
                    <span class="footer__name">Kuwamoto Misaki</span>
                </a>

                <nav class="header__nav" aria-label="フッターメニュー">
                    <!-- ↑ ヘッダーのメニューとまったく同じ見た目なので、ヘッダー用の class を使い回す -->
                    <ul class="header__list">
                        <li>
                            <a class="header__link" href="works.html">
                                <span class="header__link-en">works</span>
                                <span class="header__link-ja">制作実績</span>
                            </a>
                        </li>
                        <li>
                            <a class="header__link" href="about.html">
                                <span class="header__link-en">about me</span>
                                <span class="header__link-ja">私について</span>
                            </a>
                        </li>
                        <li>
                            <a class="header__link" href="contact.php#flow">
                                <span class="header__link-en">flow</span>
                                <span class="header__link-ja">ご依頼の流れ</span>
                            </a>
                        </li>
                    </ul>
                    <!-- ↑ ここで ul を閉じる。お問い合わせボタンは ul の外（nav の中） -->
                    <a class="header__contact" href="contact.php#contact" aria-current="page">
                        <span class="header__contact-en">contact</span>
                        <span class="header__contact-ja">お問い合わせ</span>
                    </a>
                </nav>

            </div>

            <!-- ===== SNSのリンク ===== -->
            <ul class="footer__sns">
                <li>
                    <a class="footer__sns-link" href="#" target="_blank" rel="noopener noreferrer">
                        <!-- ↑ href="#" は仮。あとで自分の Discord のURLに変える
                   target="_blank" … 新しいタブで開く
                   rel="noopener noreferrer" … 🔒セキュリティ対策（下で説明） -->
                        <img src="images/icon-discord.svg" alt="" width="24" height="24">
                        <span>discord</span>
                    </a>
                </li>
                <li>
                    <a class="footer__sns-link" href="#" target="_blank" rel="noopener noreferrer">
                        <img src="images/icon-github.svg" alt="" width="24" height="24">
                        <span>github</span>
                    </a>
                </li>
            </ul>

            <!-- ===== コピーライト ===== -->
            <small class="footer__copy">&copy; 2026 Kuwamoto Misaki</small>
            <!-- ↑ small は「注意書き・著作権表示」に使うタグ。&copy; は © マークを表す書き方 -->

        </div>
    </footer>

    <script src="js/main.js" defer></script>
    <!-- ↑ JavaScriptファイルを読み込む。defer は「HTMLを全部読み終わってから動かしてね」という意味 -->
</body>

</html>