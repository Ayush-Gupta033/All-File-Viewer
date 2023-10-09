import * as XLSX from "xlsx";
import { renderAsync } from "docx-preview";

const { read, utils } = XLSX;

export const handleExcelFile = (data) => {
  const workbook = XLSX.read(data, { type: "binary" });

  const sheetSelector = document.querySelector("#sheetSelector");
  sheetSelector.innerHTML = "";

  workbook.SheetNames.forEach((sheetName) => {
    const option = document.createElement("option");
    option.value = sheetName;
    option.textContent = sheetName;
    sheetSelector.appendChild(option);
  });

  sheetSelector.addEventListener("change", function () {
    const selectedSheet = sheetSelector.value;
    const worksheet = workbook.Sheets[selectedSheet];
    const excelData = XLSX.utils.sheet_to_html(worksheet);

    document.querySelector(".excel-table").innerHTML = excelData;
  });

  const initialSheetName = workbook.SheetNames[0];
  const initialWorksheet = workbook.Sheets[initialSheetName];
  const initialExcelData = XLSX.utils.sheet_to_html(initialWorksheet);

  document.querySelector(".excel-table").innerHTML = initialExcelData;
  document.querySelector("#sheetSelectorWrapper").style.display = "block";
};

export const handleCSVFile = (data) => {
  const lines = data.split("\n");
  const table = document.createElement("table");
  table.classList.add("excel-table");

  const headerRow = document.createElement("tr");
  const headerColumns = lines[0].split(",");
  headerColumns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  for (let i = 1; i < lines.length; i++) {
    const rowData = lines[i].split(",");
    const row = document.createElement("tr");
    rowData.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      row.appendChild(td);
    });
    table.appendChild(row);
  }

  const excelTable = document.querySelector(".excel-table");
  excelTable.innerHTML = "";
  excelTable.appendChild(table);
};

export const handleXMLFile = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");
  const xmlTable = document.createElement("table");
  xmlTable.classList.add("excel-table");

  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const firstChild = xmlDoc.documentElement.firstElementChild;
  if (firstChild) {
    for (const child of firstChild.children) {
      const headerCell = document.createElement("th");
      headerCell.textContent = child.nodeName;
      headerRow.appendChild(headerCell);
    }
    tableHeader.appendChild(headerRow);
  }

  const tableBody = document.createElement("tbody");
  for (const node of xmlDoc.documentElement.children) {
    const row = document.createElement("tr");
    for (const child of node.children) {
      const cell = document.createElement("td");
      cell.textContent = child.textContent;
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }

  xmlTable.appendChild(tableHeader);
  xmlTable.appendChild(tableBody);

  document.querySelector(".excel-table").innerHTML = "";
  document.querySelector(".excel-table").appendChild(xmlTable);
};

export const handleDOCXFile = (data) => {
  var container = document.getElementById("excelData");

  renderAsync(data, container)
    .then(function () {
      console.log("DOCX rendering finished");
    })
    .catch(function (error) {
      console.error("Error rendering DOCX:", error);
    });
};


