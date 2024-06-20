#!/usr/bin/env zx
/**
 * 本文件用于 刷新 This Week.md 的内容
 * By fanqidi @2024/6/20
 */

// this is not necessary, just for better autocomplete in VS Code
// import "zx/globals";

/**
 * 步骤：
 *  1. 获取当前 week 对应的目录
 *  2. 根据 目录下的文件名更新 This Week.md 的内容
 */


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

const _msPerDay = 24 * 60 * 60 * 1000;
const _msPerWeek = 7 * _msPerDay;

const rootDir = "/Users/fqd/workspace/fqd511/work-journal/journal";
const thisWeekFilePath = rootDir+'/This Week.md';

// date of each day in this week
const mondayDate = getDateByOrderInWeek(1);
const sundayDate = getDateByOrderInWeek(7);

// '2022'
const thisYear = mondayDate.getFullYear();
// 'Q3'
const thisQuarter = "Q" + (Math.floor(mondayDate.getMonth() / 3) + 1);

// timestamp at start of this year
const _startYear = new Date(mondayDate.getFullYear(), 0, 1, 0, 0, 0, 0);

// W01
const thisWeek =
	"W" + Math.ceil((mondayDate.getTime() - _startYear.getTime()) / _msPerWeek).toString().padStart(2, '0');

// '07'
const thisMonthNumForMon = getMonthNumericStr(mondayDate);
const thisMonthNumForSun = getMonthNumericStr(sundayDate);

// A 2-digit str, between '01' and '31'
const thisMondayInMonth = getDayNumericStrInMonth(mondayDate);
const thisSundayInMonth = getDayNumericStrInMonth(sundayDate);

// 2022/Q3/W28(0711-0717)
const weekPath = `${thisYear}/${thisQuarter}/${thisWeek}(${thisMonthNumForMon + thisMondayInMonth
}-${thisMonthNumForSun + thisSundayInMonth})`;

$.verbose = false;

// cd to right path
cd(rootDir);

const output = (await $`cd ${weekPath}/ && ls -R`).stdout.trim();

const fileNamePattern = new RegExp(/th/);

await $`echo "## Work journals for this week" > ${thisWeekFilePath}`;
await $`echo "\n> Updated at "${new Date().toLocaleString()}"\n" >> ${thisWeekFilePath}`;

output.split(/\s/).forEach((name) => {
    if (fileNamePattern.test(name)) {
        $`echo "\![](${name})" >> ${thisWeekFilePath}`;
        console.log(chalk.green(`Write "![](${name})" into ${thisWeekFilePath}`));
    }
})

console.log(chalk.green("weekly file updated successfully!"));