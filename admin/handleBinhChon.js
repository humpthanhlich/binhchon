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

// <----------------- Handle Add ----------------->

function toggleHideElement(element) {
  element.classList.toggle("hide");
}
// <----------------- DANH SÁCH THAM GIA BÌNH CHỌN ----------------->
const idbinhchon = document.getElementById("idbinhchon");
const namebinhchon = document.getElementById("namebinhchon");
const themBinhChon = document.getElementById("themBinhChon");
const formAddBinhChon = document.querySelector(".formbinhchon");
const huyAddBinhChon = formAddBinhChon.querySelector(".btn-cancel");
const addBinhChon = formAddBinhChon.querySelector(".btn-add");
const tableBinhChon = document.getElementById("dataTableBinhChon");
const dataBinhChon = tableBinhChon.getElementsByTagName("tbody")[0];

const formEditBinhChon = document.querySelector(".formeditbinhchon");

formAddBinhChon.addEventListener("click", (e) => {
  if (e.target == e.currentTarget) toggleHideElement(formAddBinhChon);
});

formEditBinhChon.addEventListener("click", (e) => {
  if (e.target == e.currentTarget) {
    toggleHideElement(formEditBinhChon);
  }
});
huyAddBinhChon.addEventListener("click", () => {
  emptyInput();
  toggleHideElement(formAddBinhChon);
});
themBinhChon.addEventListener("click", () => {
  toggleHideElement(formAddBinhChon);
});

addBinhChon.addEventListener("click", () => {
  const dbRef = ref(db);
  get(child(dbRef, "/dsbinhchon")).then((data) => {
    dataBinhChon.appendChild(
      addDataBinhChon(idbinhchon.value, namebinhchon.value, data.size)
    );
    set(ref(db, "dsbinhchon/" + data.size), {
      id: idbinhchon.value,
      name: namebinhchon.value,
      display: true,
    });

    emptyInput();
  });

  toggleHideElement(formAddBinhChon);
});

function addDataBinhChon(id, name, index, sophieu) {
  const tRow = document.createElement("tr");
  // <tr></tr>

  const tData1 = document.createElement("td");
  tData1.innerHTML = id;
  // <td>id Bình Chọn</td>

  const tData2 = document.createElement("td");
  tData2.innerHTML = name;
  // <td>Tên Bình Chọn</td>

  const tData3 = document.createElement("td");
  tData3.innerHTML = sophieu;
  // <td>0</td>

  const tData4 = document.createElement("td");
  const buttonEdit = document.createElement("button");
  buttonEdit.classList.add("btn-action");
  buttonEdit.classList.add("btn-edit");
  buttonEdit.innerHTML = renderEditSVG();
  buttonEdit.setAttribute("index", index);
  buttonEdit.setAttribute("action", "edit");
  tData4.appendChild(buttonEdit);

  // const tData5 = document.createElement("td");
  // const buttonDelete = document.createElement("button");
  // buttonDelete.classList.add("btn-action");
  // buttonDelete.classList.add("btn-delete");
  // buttonDelete.innerHTML = renderDeleteSVG();
  // buttonDelete.setAttribute("index", index);
  // buttonDelete.setAttribute("action", "delete");
  // tData5.appendChild(buttonDelete);

  tRow.appendChild(tData1);
  tRow.appendChild(tData2);
  tRow.appendChild(tData3);
  tRow.appendChild(tData4);

  buttonEdit.addEventListener("click", ActionButton);
  // buttonDelete.addEventListener("click", ActionButton);

  return tRow;
}

// <----------------- Chỉnh sửa dữ liệu ----------------->
const editIDBinhChon = formEditBinhChon.querySelector("#ideditbinhchon");
const editNameBinhChon = formEditBinhChon.querySelector("#nameeditbinhchon");

const deleteBinhChon = formEditBinhChon.querySelector(".btn-delete");
const editBinhChon = formEditBinhChon.querySelector(".btn-edit");

function ActionButton() {
  // console.log(this.getAttribute("action"));
  // console.log(this.getAttribute("index"));

  editBinhChon.setAttribute("index", this.getAttribute("index"));
  deleteBinhChon.setAttribute("index", this.getAttribute("index"));

  this.parentNode.parentNode.setAttribute("id", "here");

  const dbRef = ref(db);
  get(child(dbRef, "/dsbinhchon")).then((resposes) => {
    resposes.forEach((respose) => {
      if (respose.key == this.getAttribute("index")) {
        editIDBinhChon.value = respose.val().id;
        editNameBinhChon.value = respose.val().name;
        toggleHideElement(formEditBinhChon);
      }
    });
  });
}

editBinhChon.addEventListener("click", (e) => {
  const idindex = e.target.getAttribute("index");
  set(ref(db, "dsbinhchon/" + idindex), {
    id: editIDBinhChon.value,
    name: editNameBinhChon.value,
    display: true,
  });

  const elementHere = dataBinhChon.querySelector("#here");
  elementHere.children[0].innerHTML = editIDBinhChon.value;
  elementHere.children[1].innerHTML = editNameBinhChon.value;
  elementHere.removeAttribute("id");
  toggleHideElement(formEditBinhChon);
});

deleteBinhChon.addEventListener("click", (e) => {
  update(ref(db, "dsbinhchon/" + e.target.getAttribute("index")), {
    display: false,
  });

  dataBinhChon.querySelector("#here").remove();
  toggleHideElement(formEditBinhChon);
});

function emptyInput() {
  idbinhchon.value = "";
  namebinhchon.value = "";
}

function renderEditSVG() {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 576 512"
>
  
  <path
    d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"
  />
</svg>`;
}

// function renderDeleteSVG() {
//   return `<svg xmlns="http://www.w3.org/2000/svg" x="0px"
//   y="0px"
//   width="100"
//   height="100"
//   viewBox="0 0 30 30"
// >
//   <path
//     d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"
//   ></path>
// </svg>`;
// }

function LoadData() {
  processDataBinhChon();
}

// function renderDataBinhChon() {
//   const dbRef = ref(db);
//   get(child(dbRef, "/dsbinhchon")).then((resposes) => {
//     resposes.forEach((respose) => {
//       if (respose.val().display == true) {
//         dataBinhChon.appendChild(
//           addDataBinhChon(respose.val().id, respose.val().name, respose.key)
//         );
//       }
//     });
//   });
// }

// Data Fetching
async function fetchBinhChon() {
  const snapshot = await get(ref(db, "/dsbinhchon"));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val()).map((data) => ({ ...data, sophieu: 0 }));
}

async function fetchVotes() {
  const snapshot = await get(ref(db, "/chitietvotes"));
  return snapshot.exists() ? snapshot.val() : {};
}

// Vote Count and Ranking
async function processDataBinhChon() {
  try {
    const [binhChonList, voteData] = await Promise.all([
      fetchBinhChon(),
      fetchVotes(),
    ]);

    binhChonList.forEach((ts, index) => {
      Object.values(voteData).forEach((vote) => {
        if (vote.idbinhchon == index) {
          ts.sophieu++;
          console.log("done!");
        }
      });
    });
    binhChonList.forEach((ts, index) => {
      if (ts.display == true) {
        dataBinhChon.appendChild(
          addDataBinhChon(ts.id, ts.name, index, ts.sophieu)
        );
      }
    });
  } catch (err) {
    console.error("Lỗi xử lý dữ liệu:", err);
  }
}

window.addEventListener("load", LoadData);
