#!/usr/bin/env zx
/**
 * How to use:
 * 1. change cd path to the corresponding quarter
 * 2. run 'zx ./generate-quarter-summary.mjs'
 *
 * By fanqidi @2022/10/13
 */

// this is not necessary, just for better autocomplete in VS Code
// import "zx/globals";

/** change path to the right dir before run it */
const quarterPath = '2022/Q4'

$.verbose = false;
const output = (await $`cd ${quarterPath}/ && ls -R`).stdout.trim();

const fileNamePattern = new RegExp(/^summary\.W.*\.md$/);

await $`echo "## Summary of work journals during "${quarterPath} > ${quarterPath}/summary.md`;
await $`echo "> Updated at "${new Date().toLocaleString()} >> ${quarterPath}/summary.md`;

output.split(/\s/).forEach((name) => {
    if (fileNamePattern.test(name)) {
        $`echo "\![](${name})" >> ${quarterPath}/summary.md`;
        console.log(chalk.green(`Write "![](${name})" into ${quarterPath}/summary.md`));
    }
})
