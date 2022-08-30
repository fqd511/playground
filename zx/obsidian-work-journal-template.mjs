#!/usr/bin/env zx
/**
 * 本文件用于批量创建最新一周工作日志的 obsidian 模板
 * By fanqidi @2022/7/12
 */

// this is not necessary, just for better autocomplete in VS Code
// import "zx/globals";

/**
 * 步骤：
 *  1. cd 到包含 /template 的目录 (rootDir)
 *      检测当前目录有无 /template，没有就直接报错返回
 *  2. 计算本星期对应的周目录路径，若不存在就创建
 *  3. 将  /template 下所有文件复制到 周目录路径 下
 *  4. 将  复制后的 template 内文件重命名
 */

// dir with the /template folder in
const rootDir = "/Users/fanqidi/Documents/work-journal/journal";
// const rootDir = "./";

/** ***********  calculate date start  ************ */
const now = new Date();

const _msPerDay = 24 * 60 * 60 * 1000;
const _msPerWeek = 7 * _msPerDay;

/**
 * get date of each day in week
 * @param {number} number 1 for mon;2 for tue;...;7 for sun;
 * @returns Date 
 */
function getDateByOrderInWeek(number) { return new Date(new Date() - ((new Date().getDay() - number) * _msPerDay)) }

/**
 * get numeric str for month of given date
 * @param {Date} date 
 * @returns {string} str: '01' for date in Jan; '02' for date in Feb; etc
 */
function getMonthNumericStr(date) { return date.toLocaleString("en-US", { month: "numeric" }).padStart(2, "0") }

/**
 * get numeric str for month of given date
 * @param {*} date 
 * @returns {string} string 
 */
function getDayNumericStrInMonth(date) { return date.getDate().toString().padStart(2, "0"); }

// date of each day in this week
const mondayDate = getDateByOrderInWeek(1);
const tuesdayDate = getDateByOrderInWeek(2);
const wendesdayDate = getDateByOrderInWeek(3);
const thursdayDate = getDateByOrderInWeek(4);
const fridayDate = getDateByOrderInWeek(5);
const sundayDate = getDateByOrderInWeek(7);

// '2022'
const thisYear = mondayDate.getFullYear();
// 'Q3'
const thisQuarter = "Q" + (Math.floor(mondayDate.getMonth() / 3) + 1);
// 'Jul'
const thisMonth = mondayDate.toLocaleString("en-US", { month: "short" });
// '07'
const thisMonthNumForMon = getMonthNumericStr(mondayDate);
const thisMonthNumForTue = getMonthNumericStr(tuesdayDate);
const thisMonthNumForWen = getMonthNumericStr(wendesdayDate);
const thisMonthNumForThu = getMonthNumericStr(thursdayDate);
const thisMonthNumForFri = getMonthNumericStr(fridayDate);
const thisMonthNumForSun = getMonthNumericStr(sundayDate);

// A 2-digit str, between '01' and '31'
const thisMondayInMonth = getDayNumericStrInMonth(mondayDate);
const thisTuesdayInMonth = getDayNumericStrInMonth(tuesdayDate);
const thisWendesdayInMonth = getDayNumericStrInMonth(wendesdayDate);
const thisThursdayInMonth = getDayNumericStrInMonth(thursdayDate);
const thisFridayInMonth = getDayNumericStrInMonth(fridayDate);
const thisSundayInMonth = getDayNumericStrInMonth(sundayDate);

// timestamp at start of this year
const _startYear = new Date(mondayDate.getFullYear(), 0, 1, 0, 0, 0, 0);
const thisWeek =
	"W" + Math.ceil((mondayDate.getTime() - _startYear.getTime()) / _msPerWeek);

// 2022/Q3/W28(0711-0717)
const distDir = `${thisYear}/${thisQuarter}/${thisWeek}(${thisMonthNumForMon + thisMondayInMonth
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
	await $`test -f ${distDir}/th.Mon.md`;
	await $`test -f ${distDir}/th.Tue.md`;
	await $`test -f ${distDir}/th.Wed.md`;
	await $`test -f ${distDir}/th.Thur.md`;
	await $`test -f ${distDir}/th.Fri.md`;
} catch (e) {
	console.log(chalk.red("missing markdown file in template"));
	await $`exit 1`;
}

await $`mv -f ${distDir}/summary.md ${distDir}/summary.${thisWeek}.${thisMonth}.${thisQuarter}.md`;
await $`mv -f ${distDir}/th.Mon.md ${distDir}/${thisYear}-${thisMonthNumForMon}-${thisMondayInMonth}.th.Mon.md`;
await $`mv -f ${distDir}/th.Tue.md ${distDir}/${thisYear}-${thisMonthNumForTue}-${thisTuesdayInMonth}.th.Tue.md`;
await $`mv -f ${distDir}/th.Wed.md ${distDir}/${thisYear}-${thisMonthNumForWen}-${thisWendesdayInMonth}.th.Wed.md`;
await $`mv -f ${distDir}/th.Thur.md ${distDir}/${thisYear}-${thisMonthNumForThu}-${thisThursdayInMonth}.th.Thur.md`;
await $`mv -f ${distDir}/th.Fri.md ${distDir}/${thisYear}-${thisMonthNumForFri}-${thisFridayInMonth}.th.Fri.md`;

console.log(chalk.green("Template created successfully!"));
