const XLSX = require("xlsx");
const csvToJson = require("convert-csv-to-json");
const path = require("path");

const getJsonFromCsvFile = (localPath) => {
  return csvToJson.getJsonFromCsv(localPath);
};
module.exports.getJsonFromCsvFile = getJsonFromCsvFile;

const getJsonFromXlsxFile = (filePath) => {
  try {
    const { sheet_name_list, workbook } = readXLSXFile(filePath);
    const worksheet = workbook.Sheets[sheet_name_list[0]];
    const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    return json;
  } catch (err) {
    return null;
  }
};
module.exports.getJsonFromXlsxFile = getJsonFromXlsxFile;

const readXLSXFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath, { codepage: 65001 });

    return { sheet_name_list: workbook.SheetNames, workbook };
  } catch (error) {
    return null;
  }
};
module.exports.readXLSXFile = readXLSXFile;

const createXlsx = async (worksheets = []) => {
  if (worksheets.length === 0) return;

  const workbook = XLSX.utils.book_new(); // Create a new blank workbook

  for (let i = 0; i < worksheets.length; i++) {
    const { name, content } = worksheets[i];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(content), name); // Add the worksheet to the workbook
  }
  return workbook;
};
module.exports.createXlsx = createXlsx;

const convertIntoBuffer = (workbook) => {
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
module.exports.convertIntoBuffer = convertIntoBuffer;

const writeXlsxFile = async (workbook, filePath, fileName) => {
  const execWrite = () =>
    new Promise((resolve) => {
      XLSX.writeFileAsync(path.join(__dirname, `${filePath}/${fileName}`), workbook, (e) => {
        if (e) {
          console.log(e);
          throw new Error("La génération du fichier excel à échoué : ", e);
        }
        resolve();
      });
    });

  await execWrite();
};
module.exports.writeXlsxFile = writeXlsxFile;

const removeLine = (data, regex) => {
  return data
    .split("\n")
    .filter((val) => !regex.test(val))
    .join("\n");
};
module.exports.removeLine = removeLine;
