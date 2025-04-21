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

function toggleHideElement(element) {
  element.classList.toggle("hide");
}

const themThiSinh = document.getElementById("themThiSinh");
const formAddThiSinh = document.querySelector(".formthisinh");
const huyAddThiSinh = formAddThiSinh.querySelector(".btn-cancel");
const sbdthisinh = document.getElementById("sbdthisinh");
const namethisinh = document.getElementById("namethisinh");

const tableThiSinh = document.getElementById("dataTableThiSinh");
const btnThemThiSinh = formAddThiSinh.querySelector(".btn-add");
formAddThiSinh.addEventListener("click", (e) => {
  if (e.target == e.currentTarget) toggleHideElement(formAddThiSinh);
});
huyAddThiSinh.addEventListener("click", (e) => {
  toggleHideElement(formAddThiSinh);
});
themThiSinh.addEventListener("click", (e) => {
  toggleHideElement(formAddThiSinh);
});

// <------------------- Handle Hình Ảnh ------------------>

const inputUpLoad = document.getElementById("hinhanhthisinh");
document.querySelector(".chonanh").addEventListener("click", () => {
  inputUpLoad.click();
});

const rangeDoc = document.getElementById("rangedoc");
const rangeNgang = document.getElementById("rangengang");
const imageMiss = document.getElementsByClassName("miss")[0];

rangeNgang.oninput = function () {
  imageMiss.style.transform = `translate(${rangeNgang.value}px,${rangeDoc.value}px)`;
};
rangeDoc.oninput = function () {
  imageMiss.style.transform = `translate(${rangeNgang.value}px,${rangeDoc.value}px)`;
};

inputUpLoad.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    let url = URL.createObjectURL(file);
    imageMiss.src = url;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      imageMiss.setAttribute("src", this.result);
    });
    imageMiss.style.display = "block";

    reader.readAsDataURL(file);
  }
});

const dataThiSinh = document.getElementById("dataTableThiSinh");

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

btnThemThiSinh.addEventListener("click", () => {
  const dbRef = ref(db);
  get(child(dbRef, "/dsthisinh")).then((data) => {
    tableThiSinh.appendChild(
      addDataThiSinh(sbdthisinh.value, namethisinh.value, data.size)
    );
    set(ref(db, "dsthisinh/" + data.size), {
      id: data.size,
      sbd: sbdthisinh.value,
      name: namethisinh.value,
      display: true,
    });
  });
});

function addDataThiSinh(id, name, index) {
  const tRow = document.createElement("tr");
  // <tr></tr>

  const tData1 = document.createElement("td");
  tData1.innerHTML = id;
  // <td>SBD</td>

  const tData2 = document.createElement("td");
  tData2.innerHTML = name;
  // <td>Tên Thí Sinh</td>

  const tData3 = document.createElement("td");
  tData3.innerHTML = 0;
  // <td>Sô phiếu</td>

  const tData4 = document.createElement("td");
  const buttonEdit = document.createElement("button");
  buttonEdit.classList.add("btn-action");
  buttonEdit.classList.add("btn-edit-thisinh");
  buttonEdit.innerHTML = renderEditSVG();
  buttonEdit.setAttribute("index", index);
  buttonEdit.setAttribute("action", "editthisinh");
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

  buttonEdit.addEventListener("click", ActionButtonThiSinh);
  // buttonDelete.addEventListener("click", ActionButton);

  return tRow;
}

function ActionButtonThiSinh() {
  // editBinhChon.setAttribute("index", this.getAttribute("index"));
  // deleteBinhChon.setAttribute("index", this.getAttribute("index"));
  // this.parentNode.parentNode.setAttribute("id", "here");
  // const dbRef = ref(db);
  // get(child(dbRef, "/dsbinhchon")).then((resposes) => {
  //   resposes.forEach((respose) => {
  //     if (respose.key == this.getAttribute("index")) {
  //       editIDBinhChon.value = respose.val().id;
  //       editNameBinhChon.value = respose.val().name;
  //       toggleHideElement(formEditBinhChon);
  //     }
  //   });
  // });
}

function LoadDataThiSinh() {
  renderDataThiSinh();
}

function renderDataThiSinh() {
  const dbRef = ref(db);
  get(child(dbRef, "/dsthisinh")).then((resposes) => {
    resposes.forEach((respose) => {
      if (respose.val().display == true) {
        dataThiSinh.appendChild(
          addDataThiSinh(respose.val().sbd, respose.val().name, respose.key)
        );
      }
    });
  });
}

window.addEventListener("load", LoadDataThiSinh);
