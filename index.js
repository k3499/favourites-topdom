const addToFavoritesAllCont = document.querySelector(".project-list__container")
  ? document.querySelector(".project-list__container")
  : document.querySelector(".house__slider");

const addToFavoritesAll =
  addToFavoritesAllCont.querySelectorAll(".addToFavourites");
const favoritesContainer = document.querySelector("#favorites__List");
const removeFromFavoritesAll = favoritesContainer
  .querySelector(".favorites__List_textContainer")
  .querySelectorAll(".project");
const favoritesButton = document.querySelector(".favorites__button-desc");
const overlay = document.querySelector(".favorites__overlay");
const projectFavorite = document.querySelector(".project-favorite");
const oldFavoriteProject = localStorage.getItem("favorites");
const objectProjects = JSON.parse(oldFavoriteProject);
const favoritesMobileHeader = document.querySelector(
  ".favoritesMobile__header"
);

const showAllFavorites = () => {
  const isMobile = window.screen.availWidth <= 1070;

  if (isMobile) {
    favoritesMobileHeader.style.display = "flex";
  } else {
    favoritesButton.style.display = "block";
  }
};

const removeAllFavorites = () => {
  const isMobile = window.screen.availWidth <= 1070;

  if (isMobile) {
    favoritesMobileHeader.style.display = "none";
  } else {
    favoritesButton.style.display = "none";
  }
};

window.addEventListener("DOMContentLoaded", () => {
  if (objectProjects && Object.keys(objectProjects).length > 0) {
    //сделать перебор ключей обьекта objectProjects и вызвать showFavoritesList(); на каждой итерации
    for (let key in objectProjects) {
      showFavoritesList(objectProjects[key]);
    }
  }
  if (oldFavoriteProject) {
    showAllFavorites();
  }
});

//перебор всех проектов
addToFavoritesAll.forEach((element) => {
  const projectId = element.getAttribute("data-project-id");

  if (oldFavoriteProject) {
    for (let key in objectProjects) {
      if (objectProjects.hasOwnProperty(key)) {
        if (key === projectId) {
          element.classList.add("addToFavourites_active");
        }
      }
    }
  }

  element.addEventListener("click", () => {
    let oldFavoriteProject = JSON.parse(localStorage.getItem("favorites"));
    let favoriteProject;

    if (oldFavoriteProject) {
      if (Object.keys(oldFavoriteProject).length > 0) {
        showAllFavorites();
      } else {
        removeAllFavorites();
        oldFavoriteProject = null;
      }
    }

    favoriteProject = {
      projectId: element.getAttribute("data-project-id"),
      link: element.getAttribute("data-link"),
      image: element.getAttribute("data-image"),
      projectName: element.getAttribute("data-project-name"),
      size: element.getAttribute("data-size"),
      sanuzel: element.getAttribute("data-sanuzel"),
      floor: element.getAttribute("data-floors"),
      bedroom: element.getAttribute("data-bedroom"),
    };

    if (oldFavoriteProject !== null) {
      //  если в localStorage есть сохраненные проекты

      if (oldFavoriteProject.hasOwnProperty(favoriteProject.projectId)) {
        for (let key in oldFavoriteProject) {
          //перебираем ключи в обьекте oldFavoriteProject
          //в localStorage есть такой проект
          if (key === favoriteProject.projectId) {
            element.classList.remove("addToFavourites_active");
            const newFavoriteProject = oldFavoriteProject;
            delete newFavoriteProject[projectId];
            hideFavoritesList(favoriteProject, newFavoriteProject);
            localStorage.setItem(
              "favorites",
              JSON.stringify(newFavoriteProject)
            );
          }
        }
      } else {
        //если в localStorage нет проекта на который кликнули
        showAllFavorites();
        const newFavoriteProject = oldFavoriteProject;
        newFavoriteProject[projectId] = favoriteProject;
        showFavoritesList(favoriteProject);
        localStorage.setItem("favorites", JSON.stringify(newFavoriteProject));
        element.classList.add("addToFavourites_active");
      }
    } else {
      //если в localStorage нет ни одного сохраненного
      const newFavoriteProject = {};
      const oldFavoriteProject = {};
      newFavoriteProject[projectId] = favoriteProject;
      oldFavoriteProject[projectId] = favoriteProject;
      showFavoritesList(favoriteProject);
      showAllFavorites();
      element.classList.add("addToFavourites_active");
      localStorage.setItem("favorites", JSON.stringify(newFavoriteProject));
    }
  });
});

function deleteFromFavorites() {
  const favoritesContainer = document.querySelector("#favorites__List");
  const removeFromFavoritesAll = favoritesContainer
    .querySelector(".favorites__List_textContainer")
    .querySelectorAll(".project");

  removeFromFavoritesAll.forEach((element) => {
    const savedProjectId = element.getAttribute("data-project-id");
    const savedDislike = element.querySelector(".addToFavourites_active");

    savedDislike.addEventListener("click", () => {
      let oldFavoriteProject = JSON.parse(localStorage.getItem("favorites"));

      delete oldFavoriteProject[savedProjectId];

      element.remove();

      localStorage.setItem("favorites", JSON.stringify(oldFavoriteProject));

      if (Object.keys(oldFavoriteProject).length === 0) {
        favoritesContainer
          .querySelector(".favorites__List_textContainer")
          .querySelector(".favorites__emptyText").style.display = "flex";
      }

      document
        .querySelector(".project-list__container")
        .querySelector(`[data-project-id="${savedProjectId}"]`)
        .classList.remove("addToFavourites_active");
    });
  });
}

//function adding favorites to page
function showFavoritesList(favoritesItem) {
  const copiedFavorite = projectFavorite.cloneNode(true);
  copiedFavorite.setAttribute("data-project-id", favoritesItem.projectId);

  const linkImage = copiedFavorite
    .querySelector(".project__image-wrap")
    .querySelector(".swiper-slide-image-link");

  linkImage.setAttribute("href", favoritesItem.link);

  const image = copiedFavorite
    .querySelector(".project__image-wrap")
    .querySelector(".swiper-slide-image-link")
    .querySelector(".swiper-slide-image");

  image.setAttribute("src", favoritesItem.image);
  image.setAttribute(
    "alt",
    "Фото проекта ТопДом" +
      favoritesItem.projectName +
      "площадью" +
      favoritesItem.size +
      "м²"
  );

  const size = copiedFavorite
    .querySelector(".project__stats-wrap")
    .querySelector(".project__stats-size")
    .querySelector(".project__stats-num");

  size.textContent = favoritesItem.size;

  const sanuzel = copiedFavorite
    .querySelector(".project__stats-wrap")
    .querySelector(".project__stats-sanuzel")
    .querySelector(".project__stats-num");

  sanuzel.textContent = favoritesItem.sanuzel;

  const floor = copiedFavorite
    .querySelector(".project__stats-wrap")
    .querySelector(".project__stats-floors")
    .querySelector(".project__stats-num");

  floor.textContent = favoritesItem.floor;

  const bedroom = copiedFavorite
    .querySelector(".project__stats-wrap")
    .querySelector(".project__stats-bath")
    .querySelector(".project__stats-num");

  bedroom.textContent = favoritesItem.bedroom;

  const title = copiedFavorite
    .querySelector(".project__title-wrap")
    .querySelector(".project__title");

  title.textContent =
    "Одноэтажный дом " +
    favoritesItem.size +
    "м², " +
    favoritesItem.projectName;
  title.setAttribute("href", favoritesItem.link);
  favoritesContainer
    .querySelector(".favorites__List_textContainer")
    .querySelector(".favorites__emptyText").style.display = "none";

  favoritesContainer
    .querySelector(".favorites__List_textContainer")
    .appendChild(copiedFavorite);

  deleteFromFavorites();
}

function hideFavoritesList(favoritesItem, newFavoriteProject) {
  const listContainer = favoritesContainer.querySelector(
    ".favorites__List_textContainer"
  );
  const itemToRemove = listContainer.querySelector(
    `[data-project-id="${favoritesItem.projectId}"]`
  );
  itemToRemove.remove();

  if (Object.keys(newFavoriteProject).length === 0) {
    const emptyText = listContainer.querySelector(".favorites__emptyText");
    emptyText.style.display = "flex";
  }
}

//favorites list

document.addEventListener("DOMContentLoaded", function () {
  const favoritesButton = document.querySelector(".favorites__button-desc");
  const favoritesButtonMobile = document.querySelector(
    ".favorites__button-mobile"
  );
  const favoritesList = document.getElementById("favorites__List");
  const favoritesClose = document.querySelector(".favorites__close");

  let favMenuStatus = false;

  document.addEventListener("keydown", function (event) {
    if (favMenuStatus === true && event.key === "Escape") {
      closeFavoritesList();
    }
  });

  favoritesButton.addEventListener("click", function () {
    if (favMenuStatus === false) {
      openFavoritesList();
    } else {
      closeFavoritesList();
    }
  });
  favoritesButtonMobile.addEventListener("click", function () {
    if (favMenuStatus === false) {
      openFavoritesList();
    } else {
      closeFavoritesList();
    }
  });
  favoritesClose.addEventListener("click", function () {
    closeFavoritesList();
  });
  favoritesClose.addEventListener("click", function () {
    closeFavoritesList();
  });
  overlay.addEventListener("click", function (e) {
    e.stopPropagation();
    closeFavoritesList();
  });
  function closeFavoritesList() {
    favoritesList.style.left = "-100%";
    overlay.style.display = "none";
    favMenuStatus = false;
  }
  function openFavoritesList() {
    favoritesList.style.left = "0";
    overlay.style.display = "block";
    favMenuStatus = true;
  }
});
