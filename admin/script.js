// <----------------- Handle Menu ----------------->
const visibleMenu = document.querySelector(".menu-icon");
const contentList = document.querySelector(".content");
const contentItem = document.getElementsByClassName("content-item");

visibleMenu.addEventListener("click", () => {
  document.querySelector(".menu").classList.toggle("hidden-menu");
});

Array.prototype.forEach.call(
  document.getElementsByClassName("menu-item"),
  function (item) {
    item.addEventListener(
      "click",
      function () {
        visibleMenu.click();
        contentList.querySelector(".visible").classList.toggle("visible");
        contentItem[Number(this.getAttribute("id-index"))].classList.toggle(
          "visible"
        );
      },
      false
    );
  }
);
// <------------------ Phân trang ------------->
