#!/usr/bin/env zx
/**
 * How to use:
 *  use zx to run this file, like: 'zx ./generate-quarter-summary.mjs'
 *
 * By fanqidi @2022/10/13
 */

// this is not necessary, just for better autocomplete in VS Code
// import "zx/globals";

const _msPerDay = 24 * 60 * 60 * 1000;

/**
 * get date of each day in week
 * @param {number} number 1 for mon;2 for tue;...;7 for sun;
 * @returns Date
 */
function getDateByOrderInWeek(number) { return new Date(new Date() - ((new Date().getDay() - number) * _msPerDay)) }

// date of each day in this week
const mondayDate = getDateByOrderInWeek(1);
// '2022'
const thisYear = mondayDate.getFullYear();
// 'Q3'
const thisQuarter = "Q" + (Math.floor(mondayDate.getMonth() / 3) + 1);

/** eg: 2022/Q4 */
const quarterPath = `${thisYear}/${thisQuarter}`

$.verbose = false;

// cd to right path
const rootDir = "/Users/fanqidi/Documents/work-journal/journal";
cd(rootDir);

const output = (await $`cd ${quarterPath}/ && ls -R`).stdout.trim();

const fileNamePattern = new RegExp(/^summary\.W.*\.md$/);

await $`echo "## Summary of work journals during "${quarterPath} > ${quarterPath}/summary.md`;
await $`echo "\n> Updated at "${new Date().toLocaleString()}"\n" >> ${quarterPath}/summary.md`;

for (const name of output.split(/\s/)){
    if (fileNamePattern.test(name)) {
        await $`echo "\[${name}](${name})" >> ${quarterPath}/summary.md`;
        await $`echo "\![${name}](${name})" >> ${quarterPath}/summary.md`;
        console.log(chalk.green(`Write "![](${name})" into ${quarterPath}/summary.md`));
    }
}
