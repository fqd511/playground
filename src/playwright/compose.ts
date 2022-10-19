import { GFWCheckIn } from "./gfw";

const serviceList = [
  {
    service: GFWCheckIn,
    desc: "光速云每日签到",
  },
];

export function executeList() {
  serviceList.forEach(({ service, desc }) => {
    try {
      service().then((msg) => {
        console.log(
          `%c脚本执行成功(${new Date().toLocaleString()})：${desc}(${msg})`,
          "color:green;font-weight:bold;"
        );
      });
    } catch (error) {
      console.error(`脚本执行失败(${new Date().toLocaleString()})：${desc}`);
      console.error(error);
    }
  });
}
