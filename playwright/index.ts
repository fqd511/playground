import { GFWCheckIn } from "./gfw";

const serviceList = [
  {
    service: GFWCheckIn,
    desc: "光速云每日签到",
  },
];

// 24 hours
const INTERVAL = 1000 * 60 * 60 * 24;

function handleService() {
  serviceList.forEach(({ service, desc }) => {
    try {
      service().then(() => {
        console.log(`%c脚本执行成功：${desc}`, "color:green;font-weight:bold;");
      });
    } catch (error) {
      console.error(`脚本执行失败：${desc}`);
    }
  });
}

setInterval(handleService, INTERVAL);
