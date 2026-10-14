<?php
// ====================================================
// どのページでも使う「道具」をまとめたファイル
// public の外に置いているので、ブラウザから直接は開けない（安全）
// ====================================================

// 型（文字・数字など）のまちがいを厳しくチェックする設定
declare(strict_types=1);

/**
 * 画面に文字を出すときの「安全フィルター」
 * < > " ' & を、ただの文字に変えてから表示する（XSS対策）
 * ユーザーが入力したものを画面に出すときは、必ずこれを通す
 */
function h(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * セッション（サーバー側の一時メモ帳）を、安全な設定で始める
 */
function start_session(): void
{
    // まだ始まっていないときだけ始める
    if (session_status() === PHP_SESSION_NONE) {
        session_start([
            'cookie_httponly' => true,                     // JavaScript からメモ帳の鍵を読めないようにする
            'cookie_samesite' => 'Lax',                    // ほかのサイトから送信されたときは、鍵を付けない
            'cookie_secure'   => !empty($_SERVER['HTTPS']), // https のときは、暗号化された通信でだけ鍵を送る
            'use_strict_mode' => true,                     // 知らない鍵を使い回されないようにする
        ]);
    }
}

/**
 * CSRF トークン（合言葉）を返す。まだなければ作る
 * 「このフォームは本当にこのサイトから送られたもの？」を確かめるために使う
 */
function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        // random_bytes = 予想できないランダムな文字を作る
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * フォームから送られた文字を、安全に受け取る
 * ・送られていなければ空っぽ
 * ・文字じゃないもの（配列など）が送られてきたら空っぽ
 * ・前後の空白は取りのぞく
 */
function post_string(string $key): string
{
    $value = $_POST[$key] ?? '';
    return is_string($value) ? trim($value) : '';
}