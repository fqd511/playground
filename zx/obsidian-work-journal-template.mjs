#!/usr/bin/env zx
/**
 * 本文件用于批量创建最新一周工作日志的 obsidian 模板
 * By fanqidi @2022/7/12
 */

// this is not necessary, just for better autocomplete in VS Code
import "zx/globals";

/**
 * 步骤：
 *  1. cd 到包含 /template 的目录 (rootDir)
 *      检测当前目录有无 /template，没有就直接报错返回
 *  2. 计算本星期对应的周目录路径，若不存在就创建
 *  3. 将  /template 下所有文件复制到 周目录路径 下
 *  4. 将  周目录路径 下的 summary.md rename (summary.w28.Jul.Q3.md)
 *      如果没有 summary.md 就创建一个
 */

// dir with the /template folder in
const rootDir = "/Users/fanqidi/Documents/work-journal/journal";
// const rootDir = "./";

/** ***********  calculate date start  ************ */
const now = new Date();

// Sunday - Saturday : 0 - 6
const thisDayInWeek = now.getDay();
const _msPerDay = 24 * 60 * 60 * 1000;
const _msPerWeek = 7 * _msPerDay;

// date of monday in this week
const mondayDate = new Date(now - ((thisDayInWeek - 1) * _msPerDay));
// date of sunday in this week
const sundayDate = new Date(now - ((thisDayInWeek - 7) * _msPerDay));

// '2022'
const thisYear = mondayDate.getFullYear();
// 'Q3'
const thisQuarter = "Q" + (Math.floor(now.getMonth() / 3) + 1);
// 'Jul'
const thisMonth = mondayDate.toLocaleString("en-US", { month: "short" });
// '07'
const thisMonthNum = mondayDate
	.toLocaleString("en-US", { month: "numeric" })
	.padStart(2, "0");
// mostly same as thisMonthNum
const thisMonthNumForSun = sundayDate
	.toLocaleString("en-US", { month: "numeric" })
	.padStart(2, "0");
// An integer number, between 1 and 31
const thisMondayInMonth = mondayDate.getDate().toString().padStart(2, "0");;
// An integer number, between 1 and 31
const thisSundayInMonth = sundayDate.getDate().toString().padStart(2, "0");;

// timestamp at start of this year
const _startYear = new Date(mondayDate.getFullYear(), 0, 1, 0, 0, 0, 0);
const thisWeek =
	"W" + Math.ceil((mondayDate.getTime() - _startYear.getTime()) / _msPerWeek);

// 2022/Q3/W28(0711-0717)
const distDir = `${thisYear}/${thisQuarter}/${thisWeek}(${thisMonthNum + thisMondayInMonth
	}-${thisMonthNumForSun + thisSundayInMonth})`;
/** ***********  calculate date end    ************ */

cd(rootDir);

// check template folder
try {
  await $`test -d template`;
} catch (e) {
  console.log(chalk.red("template folder not found"));
  await $`exit 1`;
}

await $`mkdir -p ${distDir}`;
await $`cp -r template/ ${distDir}`;

// check summary.md
try {
  await $`test -f ${distDir}/summary.md`;
} catch (e) {
  console.log(chalk.red("summary.md not found"));
  await $`exit 1`;
}

await $`mv -f ${distDir}/summary.md ${distDir}/summary.${thisWeek}.${thisMonth}.${thisQuarter}.md`;
console.log(chalk.green("Template created successfully!"));
