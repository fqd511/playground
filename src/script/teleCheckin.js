/*
 * at 24/03/13/ Wed 13:32
 * @Desc: 自动点击按钮并且定时循环执行
*/

var oneMinute = 1000 * 60; // one min as interval
var intervalInMin = 60 * 6; // base interval: 6 hours
var bufferInMin = 5; // random buffer: 1-5 mins
var initialDelayInMin = 0; // delay before 1st execute

// for web k version
function clickMenu() {
	var menuButton = document.querySelector('#column-center > div.chats-container.tabs-container > div > div.chat-input.chat-input-main > div > div.rows-wrapper-wrapper > div > div.new-message-wrapper.rows-wrapper-row > button.btn-icon.toggle-reply-markup.float.show');
	menuButton.click();
	setTimeout(() => {
		var bonusButton = document.querySelector('#column-center > div.chats-container.tabs-container > div > div.chat-input.chat-input-main > div > div.rows-wrapper-wrapper > div > div.reply-keyboard.active > div > div:nth-child(3) > button:nth-child(2)');
		bonusButton.click();
		console.log('clicked at', new Date().toLocaleString());
	}, 555)
}

function startCountdown() {
	// 设置倒计时时间（单位为毫秒）
	var countdownTime = oneMinute * (intervalInMin + (Math.trunc(Math.random() * bufferInMin))); // relative time range

	// 开始倒计时
	var countdown = setInterval(function () {
		countdownTime -= oneMinute;
		console.log("倒计时剩余时间：" + countdownTime / oneMinute + "分钟");

		// 倒计时结束时点击特定元素
		if (countdownTime <= 0) {
			clearInterval(countdown); // 清除倒计时
			console.log("倒计时结束，点击");
			clickMenu();
			// 重新开始倒计时
			startCountdown();
		}
	}, oneMinute); // every minute
}

setTimeout(() => {
	clickMenu();
	// 启动倒计时
	startCountdown();
}, oneMinute * initialDelayInMin)
