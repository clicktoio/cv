const select = (el, all = false) => {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
};

const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all);

  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener));
    } else {
      selectEl.addEventListener(type, listener);
    }
  }
};

on('click', '.mobile-nav-toggle', function (e) {
  select('#navbar').classList.toggle('navbar-mobile');
  this.classList.toggle('bi-list');
  this.classList.toggle('bi-x');
});

on('click', '#navbar .nav-link', function (e) {
  let section = select(this.hash);
  if (section) {
    e.preventDefault();

    let navbar = select('#navbar');
    let header = select('#header');
    let sections = select('section', true);
    let navlinks = select('#navbar .nav-link', true);

    navlinks.forEach((item) => {
      item.classList.remove('active');
    });

    this.classList.add('active');

    if (navbar.classList.contains('navbar-mobile')) {
      navbar.classList.remove('navbar-mobile');
      let navbarToggle = select('.mobile-nav-toggle');
      navbarToggle.classList.toggle('bi-list');
      navbarToggle.classList.toggle('bi-x');
    }

    if (this.hash == '#header') {
      header.classList.remove('header-top');
      sections.forEach((item) => {
        item.classList.remove('section-show');
      });
      return;
    }

    if (!header.classList.contains('header-top')) {
      header.classList.add('header-top');
      setTimeout(function () {
        sections.forEach((item) => {
          item.classList.remove('section-show');
        });
        section.classList.add('section-show');
      }, 350);
    } else {
      sections.forEach((item) => {
        item.classList.remove('section-show');
      });
      section.classList.add('section-show');
    }

    // scrollto(this.hash);
  }
}, true);

window.addEventListener('load', () => {
  if (window.location.hash) {
    let initial_nav = select(window.location.hash);

    if (initial_nav) {
      let header = select('#header');
      let navlinks = select('#navbar .nav-link', true);

      header.classList.add('header-top');

      navlinks.forEach((item) => {
        if (item.getAttribute('href') == window.location.hash) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      setTimeout(function () {
        initial_nav.classList.add('section-show');
      }, 350);

      // scrollto(window.location.hash); 
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var typed = new Typed('#typed-output', {
      strings: ["Айдос", "фронтенд-разработчик", "веб-дизайнер"],
      typeSpeed: 50, 
      backSpeed: 30, 
      backDelay: 1000, 
      startDelay: 500, 
      loop: true 
  });
});


document.getElementById('downloadButton').addEventListener('click', function() {
    
  const fileURL = 'src/resume.pdf'; 


  const downloadLink = document.createElement('a');
  downloadLink.href = fileURL;
  downloadLink.download = 'resume.pdf';

  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});


document.addEventListener("DOMContentLoaded", function () {
  fetch("portfolio.json")
    .then(response => response.json())
    .then(data => {
      const portfolioContainer = document.getElementById("portfolio-container");

      data.forEach(item => {
        const portfolioItem = document.createElement("div");
        portfolioItem.className = `col-lg-4 col-md-6 portfolio-item ${item.category.map(cat => `filter-${cat}`).join(' ')}`;
        portfolioItem.id = `portfolio-item-${item.id}`;

        const portfolioWrap = document.createElement("div");
        portfolioWrap.className = "portfolio-wrap";

        const portfolioLink = document.createElement("a");
        portfolioLink.href = "#"; // Default to a placeholder link
        portfolioLink.setAttribute("data-gallery", "portfolioGallery");
        portfolioLink.className = "portfolio-lightbox";
        portfolioLink.target = "_blank";

        const workImg = document.createElement("div");
        workImg.className = "work-img";

        const imgElement = document.createElement("img");
        imgElement.src = item.imageSrc;
        imgElement.alt = "portfolio-work";
        imgElement.className = "img-fluid";

        workImg.appendChild(imgElement);
        portfolioLink.appendChild(workImg);
        portfolioWrap.appendChild(portfolioLink);
        portfolioItem.appendChild(portfolioWrap);
        portfolioContainer.appendChild(portfolioItem);

        // Добавим обработчик клика на ссылку
        portfolioLink.addEventListener("click", function (event) {
          event.preventDefault(); // Отменяем стандартное поведение перехода по ссылке
          checkLinks(item.websiteLink, item.designLink);
        });
      });

      const portfolioFilters = document.getElementById("portfolio-flters").getElementsByTagName("li");
      for (const filter of portfolioFilters) {
        filter.addEventListener("click", function () {
          for (const f of portfolioFilters) {
            f.classList.remove("filter-active");
          }
          this.classList.add("filter-active");

          const selectedFilter = this.getAttribute("data-filter");
          const portfolioItems = portfolioContainer.getElementsByClassName("portfolio-item");
          for (const item of portfolioItems) {
            item.style.display = "none";
          }
          const filteredItems = portfolioContainer.querySelectorAll(selectedFilter);
          for (const item of filteredItems) {
            item.style.display = "block";
          }
        });
      }
    })
    .catch(error => console.error("Error fetching portfolio data:", error));


    function checkLinks(websiteLink, designLink) {
      if (websiteLink && websiteLink !== "#") {
        var xhrWebsite = new XMLHttpRequest();
        xhrWebsite.open("GET", websiteLink, true);
        xhrWebsite.onreadystatechange = function () {
          if (xhrWebsite.readyState == 4) {
            if (xhrWebsite.status == 200) {
              window.location.href = websiteLink;
            } else {
              checkDesignLink();
            }
          }
        };
        xhrWebsite.send();
      } else {
        checkDesignLink();
      }
    
      function checkDesignLink() {
        if (designLink && designLink !== "#") {
          var xhrDesign = new XMLHttpRequest();
          xhrDesign.open("GET", designLink, true);
          xhrDesign.onreadystatechange = function () {
            if (xhrDesign.readyState == 4) {
              if (xhrDesign.status == 200) {
                if (confirm(`Ссылка ${websiteLink} недоступна. Перейти на ${designLink}?`)) {
                  window.location.href = designLink;
                }
              } else {
                showAlert();
              }
            }
          };
          xhrDesign.send();
        } else {
          showAlert();
        }
      }
    
      function showAlert() {
        alert(`Ссылки ${websiteLink} и ${designLink} недоступны.`);
        window.location.href = "404.html";
      }
    }
    
});












// document.addEventListener("DOMContentLoaded", function () {
//   fetch("portfolio.json")
//     .then(response => response.json())
//     .then(data => {
//       const portfolioContainer = document.getElementById("portfolio-container");

//       data.forEach(item => {
//         const portfolioItem = document.createElement("div");
//         portfolioItem.className = `col-lg-4 col-md-6 portfolio-item ${item.category.map(cat => `filter-${cat}`).join(' ')}`;
//         portfolioItem.id = `portfolio-item-${item.id}`;

//         const portfolioWrap = document.createElement("div");
//         portfolioWrap.className = "portfolio-wrap";

//         const portfolioLink = document.createElement("a");
//         portfolioLink.href = item.websiteLink || item.designLink || "#";
//         // portfolioLink.href = item.imageSrc;
//         portfolioLink.setAttribute("data-gallery", "portfolioGallery");
//         portfolioLink.className = "portfolio-lightbox";
//         portfolioLink.target = "_blank";

//         const workImg = document.createElement("div");
//         workImg.className = "work-img";

//         const imgElement = document.createElement("img");
//         imgElement.src = item.imageSrc;
//         imgElement.alt = "portfolio-work";
//         imgElement.className = "img-fluid";

//         workImg.appendChild(imgElement);
//         portfolioLink.appendChild(workImg);
//         portfolioWrap.appendChild(portfolioLink);
//         portfolioItem.appendChild(portfolioWrap);
//         portfolioContainer.appendChild(portfolioItem);
//       });

//       const portfolioFilters = document.getElementById("portfolio-flters").getElementsByTagName("li");
//       for (const filter of portfolioFilters) {
//         filter.addEventListener("click", function () {
//           for (const f of portfolioFilters) {
//             f.classList.remove("filter-active");
//           }
//           this.classList.add("filter-active");

//           const selectedFilter = this.getAttribute("data-filter");
//           const portfolioItems = portfolioContainer.getElementsByClassName("portfolio-item");
//           for (const item of portfolioItems) {
//             item.style.display = "none";
//           }
//           const filteredItems = portfolioContainer.querySelectorAll(selectedFilter);
//           for (const item of filteredItems) {
//             item.style.display = "block";
//           }
//         });
//       }
//     })
//     .catch(error => console.error("Error fetching portfolio data:", error));
// });













