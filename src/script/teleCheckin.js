/*
 * at 24/03/13/ Wed 13:32
 * @Desc: 自动点击按钮并且定时循环执行
*/

var oneMinute = 1000 * 60; // one min as interval
var intervalInMin = 60 * 6; // base interval: 6 hours
var bufferInMin = 5; // random buffer: 1-5 mins
var timeGap = oneMinute * (intervalInMin + (Math.trunc(Math.random() * bufferInMin))); // relative time range
var lastClickTimeStamp = new Date('2024/3/17 04:43').getTime()

// click and update lastClickTimeStamp/timeGap
function clickMenu() {
    var menuButton = document.querySelector('#column-center > div.chats-container.tabs-container > div > div.chat-input.chat-input-main > div > div.rows-wrapper-wrapper > div > div.new-message-wrapper.rows-wrapper-row > button.btn-icon.toggle-reply-markup.float.show');
    if (menuButton) {
        menuButton.click();
        setTimeout(() => {
            var bonusButton = document.querySelector('#column-center > div.chats-container.tabs-container > div > div.chat-input.chat-input-main > div > div.rows-wrapper-wrapper > div > div.reply-keyboard.active > div > div:nth-child(3) > button:nth-child(2)');
            if (bonusButton) {
                bonusButton.click();
                console.log(`%c Click:${new Date().toLocaleString()}`, 'color:green;font-weight:bold;');

                // update variables
                lastClickTimeStamp = Date.now();
                timeGap = oneMinute * (intervalInMin + (Math.trunc(Math.random() * bufferInMin)));
            } else {
                console.log(`%c Click fail`, 'color:red;font-weight:bold;');
            }
        }, 555)
    } else {
        console.log(`%c No Menu Button`, 'color:red;font-weight:bold;');
    }
}

function execute() {
    var current = Date.now();
    const timeLeft = (lastClickTimeStamp + timeGap) - current;
    if (timeLeft > 1000) {
        console.log(new Date().toLocaleString(), "剩余：" + ((timeLeft) / oneMinute).toFixed(2) + "分");
    } else {
        console.log("倒计时结束，点击");
        clickMenu();
    }
}

lastClickTimeStamp = new Date('2024/3/17 04:43').getTime()
execute();
setInterval(execute, oneMinute); // every minute

console.log(`%c oneMinute:${oneMinute / 1000} s`, 'color:green;font-weight:bold;');
console.log(`%c intervalInMin:${intervalInMin} min`, 'color:green;font-weight:bold;');
console.log(`%c lastClickTimeStamp:${new Date(lastClickTimeStamp).toLocaleString()}(${lastClickTimeStamp})`, 'color:green;font-weight:bold;');
console.log(`%c timeGap:${Math.trunc(timeGap / oneMinute / 60)}hours${timeGap / oneMinute % 60}min`, 'color:green;font-weight:bold;');
console.log(`%c 剩余:${(((lastClickTimeStamp + timeGap) - Date.now()) / oneMinute).toFixed(2)}min`, 'color:green;font-weight:bold;');
