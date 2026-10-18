<?php
// ====================================================
// お問い合わせフォームから送られた内容をチェックする係
// ====================================================
declare(strict_types=1);

require_once __DIR__ . '/../app/functions.php';

start_session();

// ----- ① フォームから送られてきたか？ -----
// アドレス欄に send.php と打って直接開いた場合などは、フォームに戻す
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.php');
    exit;
}

// ----- ② 合言葉（CSRF トークン）は合っているか？ -----
// hash_equals = 2つの文字が同じか、安全に比べる
$postedToken = post_string('csrf_token');
if (!hash_equals($_SESSION['csrf_token'] ?? '', $postedToken)) {
    // ちがったら、中身は見ずにここで止める（ほかのサイトからのなりすまし送信を防ぐ）
    http_response_code(400);
    exit('不正なアクセスです。お手数ですが、もう一度フォームからお送りください。');
}

// ----- ③ 入力された内容を受け取る -----
$name    = post_string('name');
$company = post_string('company');
$email   = post_string('email');
$message = post_string('message');
$agree   = post_string('agree') === '1';

// ----- ④ 中身をチェックする（ブラウザのチェックは外せるので、ここが本当の守り） -----
$errors = [];

// お名前
if ($name === '') {
    $errors['name'] = 'お名前を入力してください。';
} elseif (mb_strlen($name) > 50) {
    $errors['name'] = 'お名前は50文字以内で入力してください。';
} elseif (preg_match('/[\r\n]/', $name)) {
    // 名前に改行が入っていたらはじく（メールの仕組みを悪用されないように）
    $errors['name'] = 'お名前に改行は使えません。';
}

// 会社名（任意なので、空っぽはOK）
if (mb_strlen($company) > 100) {
    $errors['company'] = '会社名・団体名は100文字以内で入力してください。';
}

// メールアドレス
if ($email === '') {
    $errors['email'] = 'メールアドレスを入力してください。';
} elseif (mb_strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    // filter_var = 「メールアドレスの形になっているか」を PHP が調べてくれる
    $errors['email'] = '正しいメールアドレスを入力してください。';
}

// ご相談内容
if ($message === '') {
    $errors['message'] = 'ご相談内容を入力してください。';
} elseif (mb_strlen($message) > 2000) {
    $errors['message'] = 'ご相談内容は2000文字以内で入力してください。';
}

// プライバシーポリシーへの同意
if (!$agree) {
    $errors['agree'] = 'プライバシーポリシーへの同意が必要です。';
}

// ----- ⑤ まちがいがあったら、フォームに戻す -----
if ($errors) {
    // エラーと入力内容をメモ帳（セッション）に書いて、contact.php で表示してもらう
    $_SESSION['errors'] = $errors;
    $_SESSION['old'] = [
        'name'    => $name,
        'company' => $company,
        'email'   => $email,
        'message' => $message,
        'agree'   => $agree,
    ];
    header('Location: contact.php#contact');
    exit;
}

// ----- ⑥ ここまで来たら、入力はぜんぶOK -----
// メールを送る部分は、公開するサーバーが決まってから作る

// 使い終わった合言葉は捨てる（同じ内容が2回送られるのを防ぐ）
unset($_SESSION['csrf_token']);

// 完了ページへ（次に作る）
header('Location: thanks.php');
exit;
