#!/usr/bin/env zx
/**
 * 本文件用于批量创建最新一周工作日志的 obsidian 模板
 * By fanqidi @2022/7/12
 */

// this is not necessary, just for better autocomplete in VS Code
import 'zx/globals'

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
// const rootDir = '~/Documents/work-journal/journal'
const rootDir = './'

const now  = new Date();
// '2022'
const thisYear = now.getFullYear();
// 'Q3'
const thisQuarter = 'Q'+(now.getMonth()/3 +1);
// 'Jul'
const thisMonth = now.toLocaleString('en-US',{month:'short'});
// '07'
const thisMonthNum = now.toLocaleString('en-US',{month:'numeric'}).padStart(2, '0');
// Sunday - Saturday : 0 - 6
const thisDayInWeek = now.getDay()
// An integer number, between 1 and 31
const thisDayInMonth = now.getDate()
const mondayNum = thisDayInMonth - thisDayInWeek +1
const sundayNum = thisDayInMonth - thisDayInWeek +7

const _startYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
const _msPerWeek = 7*24 * 60 * 60 * 1000;
const thisWeek = 'W'+Math.ceil((now.getTime() - _startYear.getTime()) / _msPerWeek);

// 2022/Q3/W28(0711-0717)
const distDir = `${thisYear}/${thisQuarter}/${thisWeek}(${thisMonthNum+mondayNum}-${thisMonthNum+sundayNum})`

// echo(thisMonthNum+mondayNum)
echo(distDir)

// await $`mkdir ${distDir}`
