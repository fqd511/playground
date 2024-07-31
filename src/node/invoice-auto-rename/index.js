const fs = require("fs");
const path = require("path");
const os = require("os");
const pdf = require("pdf-parse");

const folderPath = path.join(os.homedir(), "/Downloads/invoice/");

const typeLabels = ["餐饮", "医药", "客运", "设备"];
fs.readdir(folderPath, async (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file).toLowerCase() === ".pdf") {
      const filePath = path.join(folderPath, file);
      let invoiceAmount, invoiceDate, invoiceType, invoiceCode;

      // 处理一下高德打车发票，直接中命名中提取信息
      if (file.includes("高德打车电子发票")) {
        invoiceAmount = file.split("-")[1].slice(0, -1);
        invoiceCode = Date.now().toString() + "_";
        invoiceType = "客运发票";
        invoiceDate = new Date();
        renameFile({
          invoiceAmount,
          invoiceDate,
          invoiceType,
          invoiceCode,
          filePath,
          file,
        });
      } else {
        // 根据 pdf 内容识别处理
        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}: ${err}`);
            return;
          }
          pdf(data)
            .then(function (pdfData) {
              const text = pdfData.text;

              // Extract date
              const regexDate = /(\d{4}[\s年]+\d{2}[\s月]+\d{2}[\s日]+)/;
              const dateMatch = text.match(regexDate);

              invoiceDate = dateMatch
                ? new Date(dateMatch[1].replaceAll(/[年月日]/g, "/"))
                : "";

              // Extract code
              const regexCode = /(\d{20})/;
              const codeMatch = text.match(regexCode);
              invoiceCode = codeMatch
                ? codeMatch[1]
                : Date.now().toString() + "_";

              // extract amount
              const regexAmount = /[¥￥]\s*(\d+\.\d{2})/g;
              let maxAmount = 0;
              let amountMatch;
              while ((amountMatch = regexAmount.exec(text)) !== null) {
                const amount = parseFloat(amountMatch[1]);
                if (amount > maxAmount) {
                  maxAmount = amount;
                }
              }
              invoiceAmount = maxAmount ? `${maxAmount.toFixed(2)}` : "";

              if (!invoiceDate || !invoiceAmount) {
                console.log("信息提取失败，文件内容如下：\n\n", text);
              }

              // extract type
              invoiceType = "";
              typeLabels.forEach((i) => {
                if (!invoiceType && text.includes(i)) invoiceType = i + "发票";
              });
              renameFile({
                invoiceAmount,
                invoiceDate,
                invoiceType,
                invoiceCode,
                filePath,
                file,
              });
            })
            .catch((err) => {
              console.error(`Error parsing PDF ${file}: ${err}`);
            });
        });
      }
    }
  });
});

function parseDate(date) {
  const year = date.getFullYear().toString().slice(2); // 获取年份的后两位
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 获取月份，并补齐为两位数
  const day = date.getDate().toString().padStart(2, "0"); // 获取日期，并补齐为两位数
  return year + month + day;
}

function renameFile({
  invoiceAmount,
  invoiceDate,
  invoiceType,
  invoiceCode,
  filePath,
  file,
}) {
  // Rename the PDF file based on extracted information
  const newFileName = `${parseDate(invoiceDate)}_${
    invoiceType || "其他发票"
  }_${invoiceAmount}_${invoiceCode.slice(-8)}.pdf`;
  const newFilePath = path.join(folderPath, newFileName);

  fs.rename(filePath, newFilePath, (err) => {
    if (err) {
      console.error(`Error renaming file ${file}: ${err}`);
      return;
    }
    console.log(`文件重命名: ${file} => ${newFileName}`);
  });
}
