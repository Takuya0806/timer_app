/*
カウントダウンする時間設定をtimeToCountDownとする
経過時間をelapsedTimeとする
残り時間をtimeLeftとする
timeLeft = timeToCountDown - elapsedTime;
elapsedTime = Date.now() - startTime; 
startTime = Date.now(); （startTimeはStartボタンをクリックした時の時間）
*/

(function() {
    'use strict'; // 厳密なエラーチェック

    // 要素の取得
    var timer = document.getElementById('timer');
    var min = document.getElementById('min');
    var sec = document.getElementById('sec');
    var reset = document.getElementById('reset');
    var start = document.getElementById('start');

    var timeLeft; //残り時間
    var timeToCountDown = 0;
    var timerId; // clearTimeoutを渡すための変数
    var startTime; 
    var isRunning = false; // 初期値はfalse

    // ミリ秒を分や秒に変換する機能
    function updateTimer(t) {
        var d = new Date(t); // 渡されたtで現在日時を取得
        var m = d.getMinutes(); // dから分を取得
        var s = d.getSeconds(); // dから秒を取得
        var ms = d.getMilliseconds(); // dからミリ秒を取得
        var timerString;

        // 桁が足りなかった場合に0を付ける
        m = ('0' + m).slice(-2); // 先頭に0の文字列をつけ、slice(-2)で末尾2桁を表示
        s = ('0' + s).slice(-2); // 先頭に0の文字列をつけ、slice(-2)で末尾2桁を表示
        ms = ('00' + ms).slice(-3); // 先頭に00の文字列をつけ、slice(-3)で末尾3桁を表示
        timerString = m + ':' + s + '.' + ms; // timerの中身を書き換え
        timer.textContent = timerString; // timerに出力
        document.title = timerString; // タイトルもタイマー表示にする
    };    

    // カウントダウン機能
    function countDown() {
        timerId = setTimeout(function() {
            // var elapsedTime = Date.now() - startTime;
            // timeLeft = timeToCountDown - elapsedTime;
            timeLeft = timeToCountDown - (Date.now() - startTime);

            // 残り時間が0になった時の処理
            if (timeLeft < 0) {
                isRunning = false; // 0になったらfalseに戻してあげる
                start.textContent = 'Start'; // Stopボタンのままなので、Startに戻してあげる
                clearTimeout(timerId); // カウントダウンの停止
                timeLeft = 0; // きれいに0で止まらないので、0を代入して更新
                updateTimer(timeLeft);// 更新されたtimeLeftの表示を整える
                timeToCountDown = 0; // timeToCountDownを0にし、再度スタートボタンを押しても始まらないようにする

                // 下でcountDown()がまた呼ばれていて処理が再実行されてしまうので、returnで止める
                return;
            }

            updateTimer(timeLeft); // 残り時間表示
            countDown(); // カウントダウン機能を再帰的に実行
        }, 10); // 10ミリ秒後に実行（1秒以下の残り時間も表示）

    }

    // Startボタンを押した時の処理
    start.addEventListener('click', function() {

        if (isRunning === false) {
            isRunning = true;
            start.textContent = 'Stop'; // StartボタンをStopボタンに変更
            // カウントダウンの開始
            startTime = Date.now();
            countDown();
        } else {
            isRunning = false;
            start.textContent = 'Start'; // StopボタンをStartボタンに変更
            timeToCountDown = timeLeft; // stopした時点での時間を表示
            clearTimeout(timerId); // カウントダウンの停止
        }

    });

    // Minボタンを押した時の処理
    min.addEventListener('click', function() {
        // タイマーが動いている間はボタン操作を無効にする
        if (isRunning === true) {
            return;
        }

        // 60分を超えたら0に戻す
        if (timeToCountDown >= 60 * 60 * 1000) {
            timeToCountDown = 0;
        }

        timeToCountDown += 60 * 1000; // 押されるたびに60秒ずつ増やす
        updateTimer(timeToCountDown); // updateTimerに反映
    });

    // Secボタンを押した時の処理
    sec.addEventListener('click', function() {
        // タイマーが動いている間はボタン操作を無効にする
        if (isRunning === true) {
            return;
        }

        // 60分を超えたら0に戻す
        if (timeToCountDown >= 60 * 60 * 1000) {
            timeToCountDown = 0;
        }        

        timeToCountDown += 1000; // 押されるたびに1秒ずつ増やす（1000ミリ秒 = 1秒）
        updateTimer(timeToCountDown); // updateTimerに反映
    });

    // Restボタンを押した時の処理
    reset.addEventListener('click', function() {
        timeToCountDown = 0;
        updateTimer(timeToCountDown); // updateTimerに反映
    });
})();