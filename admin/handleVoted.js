import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIXpXQ2bZewn8aFLilngsJu453UCirwVg",
  authDomain: "cuocthisacdep-8536d.firebaseapp.com",
  databaseURL: "https://cuocthisacdep-8536d-default-rtdb.firebaseio.com",
  projectId: "cuocthisacdep-8536d",
  storageBucket: "cuocthisacdep-8536d.firebasestorage.app",
  messagingSenderId: "590245990634",
  appId: "1:590245990634:web:a97607314242227ea2c793",
};
const app = initializeApp(firebaseConfig);

import {
  getDatabase,
  ref,
  child,
  get,
  set,
  update,
  query,
  limitToLast,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const db = getDatabase();

const tableVoted = document.getElementById("dataTableVoted");
const dataVoted = tableVoted.getElementsByTagName("tbody")[0];

async function GetNameThiSinh(idThiSinh) {
  try {
    const dataRef = ref(db, "/dsthisinh");
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const foundThiSinh = Object.values(data).find(
        (thiSinh) => thiSinh.id === idThiSinh
      );

      if (foundThiSinh) {
        return foundThiSinh.name;
      } else {
        return "<Không xác định1>";
      }
    } else {
      return "<Không xác định2>";
    }
  } catch (error) {
    console.error("Lỗi khi lấy tên thí sinh:", error);
    return "<Lỗi khi truy xuất>";
  }
}

async function GetNameBinhChon(idBinhChon) {
  try {
    const dataRef = ref(db, "/dsbinhchon");
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const foundBinhChon = Object.values(data).find((binhChon, index) => {
        if (index === idBinhChon) {
          return binhChon;
        }
      });

      if (foundBinhChon) {
        return foundBinhChon.name;
      } else {
        return "<Không xác định1>";
      }
    } else {
      return "<Không xác định2>";
    }
  } catch (error) {
    console.error("Lỗi khi lấy tên người bình chọn:", error);
    return "<Lỗi khi truy xuất>";
  }
}

async function GetDataVoted() {
  const dataRef = ref(db, "/chitietvotes");
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    const resultArray = Object.keys(data).map((key) => {
      return { ...data[key], thoigian: key };
    });
    return resultArray;
  } else {
    return resultArray;
  }
}

async function renderDataVoted() {
  try {
    const getdataVoted = await GetDataVoted(); // Lấy dữ liệu voted

    const promises = getdataVoted.map(async (value) => {
      const tenThiSinh = await GetNameThiSinh(Number(value.idmiss));
      const tenBinhChon = await GetNameBinhChon(Number(value.idbinhchon));
      return {
        thoigian: value.thoigian,
        tenThiSinh: tenThiSinh,
        tenBinhChon: tenBinhChon,
      };
    });

    const results = (await Promise.all(promises)).reverse();

    results.forEach((result) => {
      dataVoted.appendChild(
        addDataVoted(
          result.thoigian,
          `${result.tenBinhChon} đã bình chọn cho ${result.tenThiSinh}`
        )
      );
    });
  } catch (error) {
    console.error("Lỗi khi xử lý dữ liệu voted:", error);
    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
  }
}

// async function renderDataVoted() {
//   const getdataVoted = await GetDataVoted();

//   getdataVoted.map((value, index) => {
//     console.log(value);
//     dataVoted.appendChild(
//       addDataVoted(value.thoigian, GetNameThiSinh(Number(value.idmiss)))
//     );
//   });

// }

function addDataVoted(thoigian, noidung) {
  const tRow = document.createElement("tr");
  const tThoiGian = document.createElement("td");
  tThoiGian.textContent = formatTimestamp(Number(thoigian));
  const tNoiDung = document.createElement("td");
  tNoiDung.textContent = noidung;

  tRow.appendChild(tThoiGian);
  tRow.appendChild(tNoiDung);

  return tRow;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

// <--------------------- Phân trang ---------------------->
function paginateTable(table, rowsPerPage) {
  const rows = Array.from(table.tBodies[0].rows).filter(
    (row) => row.style.display !== "none"
  );
  const rowCount = rows.length;
  const pageCount = Math.ceil(rowCount / rowsPerPage);
  let currentPage = 1;

  function displayRows(page) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach((row, i) => {
      row.style.display = i >= start && i < end ? "" : "none";
    });
  }

  function createPaginationButtons() {
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";

    function createButton(text, page) {
      const button = document.createElement("button");
      button.textContent = text;
      if (page === currentPage) {
        button.disabled = true;
        button.style.fontWeight = "bold";
        button.style.backgroundColor = "#007bff";
        button.style.color = "white";
      }
      button.addEventListener("click", () => {
        currentPage = page;
        displayRows(currentPage);
        createPaginationButtons();
      });
      paginationDiv.appendChild(button);
    }

    if (currentPage > 1) {
      createButton("«", 1);
      createButton("‹", currentPage - 1);
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pageCount, currentPage + 2);

    if (currentPage <= 2) {
      endPage = Math.min(5, pageCount);
    } else if (currentPage >= pageCount - 1) {
      startPage = Math.max(1, pageCount - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      createButton(i, i);
    }

    if (currentPage < pageCount) {
      createButton("›", currentPage + 1);
      createButton("»", pageCount);
    }
  }

  displayRows(currentPage);
  createPaginationButtons();
}

window.addEventListener("load", async () => {
  await renderDataVoted();
  const dateFilter = document.getElementById("dateFilter");

  function filterByDate() {
    const selectedDate = dateFilter.value; // yyyy-MM-dd
    const rows = tableVoted.tBodies[0].rows;

    console.log(dateFilter);
    console.log(dateFilter.value);

    for (let row of rows) {
      const timeText = row.cells[0].textContent;
      const datePart = timeText.split(" ")[1]; // dd/MM/yyyy
      const [day, month, year] = datePart.split("/");
      const formatted = `${year}-${month}-${day}`;

      // Nếu không chọn ngày, hiện tất cả
      row.style.display =
        !selectedDate || selectedDate === formatted ? "" : "none";
    }

    paginateTable(tableVoted, 10);
  }

  dateFilter.addEventListener("change", filterByDate);

  // Gọi ban đầu để hiển thị tất cả
  paginateTable(tableVoted, 10);
});
