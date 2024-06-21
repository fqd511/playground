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
function getDateByOrderInWeek(number) {
    return new Date(new Date() - ((new Date().getDay() - number) * _msPerDay))
}

/**
 * get numeric str for month of given date
 * @param {Date} date
 * @returns {string} str: '01' for date in Jan; '02' for date in Feb; etc
 */
function getMonthNumericStr(date) {
    return date.toLocaleString("en-US", {month: "numeric"}).padStart(2, "0")
}

/**
 * get numeric str for month of given date
 * @param {*} date
 * @returns {string} string
 */
function getDayNumericStrInMonth(date) {
    return date.getDate().toString().padStart(2, "0");
}

const _msPerDay = 24 * 60 * 60 * 1000;
const _msPerWeek = 7 * _msPerDay;

const rootDir = "/Users/fqd/workspace/fqd511/work-journal/journal";
const thisWeekFilePath = rootDir + '/Progress.md';

// date of each day in this week
const mondayDate = getDateByOrderInWeek(1);
const sundayDate = getDateByOrderInWeek(7);

// '2022'
const thisYear = mondayDate.getFullYear();
// 'Q3'
const thisQuarter = "Q" + (Math.floor(mondayDate.getMonth() / 3) + 1);
// 2024-06-20
const today = thisYear + '-' + new Date().toLocaleString("en-US", {month: "numeric"}).padStart(2, "0") + '-' + new Date().getDate().toString().padStart(2, "0");

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

// file list output from ls
const allFileListOutput = (await $`find . -type f`).stdout.trim();
const weekFileListOutput = (await $`cd ${weekPath}/ && ls -Ra`).stdout.trim();

// patterns for file names
const thisWeekFileNamePattern = new RegExp(/th/);
const weekSummariesFileNamePattern = new RegExp(/summary.W/);
const quarterSummariesFileNamePattern = new RegExp(/summary.md/);

// work journal files for (this week)/(week summary)/(quarter summary)
const workJournalFileInThisWeek = weekFileListOutput.split(/\s/).filter(name => thisWeekFileNamePattern.test(name));
const weekSummariesFileList = allFileListOutput.split(/\s/).filter(name => weekSummariesFileNamePattern.test(name));
const quarterSummariesFileList = allFileListOutput.split(/\s/).filter(name => quarterSummariesFileNamePattern.test(name) && !name.includes('template'));

await $`echo "# Work Journal" > ${thisWeekFilePath}`;
await $`echo "\n> Updated at "${new Date().toLocaleString()}"" >> ${thisWeekFilePath}`;
await $`echo "\n---" >> ${thisWeekFilePath}`;

// if today's file exists, add it to the top of the list
const todayFile = workJournalFileInThisWeek.find(name => name.includes(today));
if (todayFile) {
    await $`echo "\n## Today" >> ${thisWeekFilePath}`;
    await $`echo "\n![${todayFile}](${todayFile})" >> ${thisWeekFilePath}`;
    console.log(chalk.green(`Write ${todayFile} into ${thisWeekFilePath}`));
}

await $`echo "\n## This Week" >> ${thisWeekFilePath}`;
for (const name of workJournalFileInThisWeek) {
    await $`echo "\n[${name}](${name})" >> ${thisWeekFilePath}`;
    await $`echo "\n![${name}](${name})" >> ${thisWeekFilePath}`;
    console.log(chalk.green(`Write "[${name}](${name})" into ${thisWeekFilePath}`));
}

await $`echo "\n## Summaries" >> ${thisWeekFilePath}`;
await $`echo "\n---" >> ${thisWeekFilePath}`;

await $`echo "\n### Week Summaries" >> ${thisWeekFilePath}`;
for (const item of weekSummariesFileList.sort().reverse()) {
    const label = item.slice(2)
    await $`echo ${"\n[" + label + "](" + item + ")"} >> ${thisWeekFilePath}`;
    await $`echo ${"\n![" + label + "](" + item + ")"} >> ${thisWeekFilePath}`;
    console.log(chalk.green(`Write ${item} into ${thisWeekFilePath}`));
}

await $`echo "\n### Quarter Summaries" >> ${thisWeekFilePath}`;
for (const item of quarterSummariesFileList.sort().reverse()) {
    const name = item.slice(2)
    await $`echo "\n[${name}](${item})" >> ${thisWeekFilePath}`;
    await $`echo "\n![${name}](${item})" >> ${thisWeekFilePath}`;
    console.log(chalk.green(`Write ${item} into ${thisWeekFilePath}`));
}

console.log(chalk.green("weekly file updated successfully!"));
