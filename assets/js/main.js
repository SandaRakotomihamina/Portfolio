(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Contact Form Handling
   */
  const contactForm = document.querySelector('.modern-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const loading = this.querySelector('.loading');
      const errorMessage = this.querySelector('.error-message');
      const sentMessage = this.querySelector('.sent-message');

      // Hide previous messages
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';

      // Show loading
      loading.style.display = 'block';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';

      // Send AJAX request
      fetch('forms/contact.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur serveur ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        loading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer le Message';

        if (data.status === 'success') {
          sentMessage.style.display = 'block';
          errorMessage.style.display = 'none';
          contactForm.reset();
        } else {
          errorMessage.textContent = data.message || 'Erreur lors de l\'envoi du message.';
          errorMessage.style.display = 'block';
          sentMessage.style.display = 'none';
        }
      })
      .catch(error => {
        loading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer le Message';
        errorMessage.textContent = 'Erreur lors de l\'envoi. Veuillez réessayer.';
        errorMessage.style.display = 'block';
        sentMessage.style.display = 'none';
        console.error('Contact form error:', error);
      });
    });
  }

  /*
    Script for portfolio-details
  */

  const projets = {
      star_game: {
          titre: "Star Game",
          description: "Jeu mobile en Python",
          details:"Projet personnel que j'ai réalisé en voulant m'intéresser d'avantage au langage python. </br> Elle met en scene une guerre interstelaire avec en rôle principal, un petit vaiseau qui tire sur des missiles ennemi. C'est un jeu sensé être sur plateforme mobile mais j'ai laisser un code encore brûte pour donné de la polyvalence au personne qui souhaite utilisé le projet. </br> Le code est disponible sur mon compte github via ce lien: <a href='https://github.com/SandaRakotomihamina/Star-game'>cliquer ici</a>",
          images: [
              "assets/img/portfolio/star_game/stargame0.png",
              "assets/img/portfolio/star_game/stargame1.png",
              "assets/img/portfolio/star_game/stargame2.png",
              "assets/img/portfolio/star_game/stargame3.png",
              "assets/img/portfolio/star_game/stargame4.png"
          ]
      },

      stock: {
          titre: "Gestion de Stock",
          description: "Application web en Vue.js et PHP",
          details:"C'est un projet accadémique que j'ai réaliser permetant de gérer une grande quantité des resources d'un producteur locaux, elle m'a permis d'approfondrir mes conessance sur le framework Vue.JS et les fondamentaux de Javascript, AJAX et JQUERY. </br>Elle à été faite durant ma deuxième année de licence et le code est visuatilable sur le lien: <a href='https://github.com/SandaRakotomihamina/Gestion-des-stock'>cliquer ici</a>",
          images: [
              "assets/img/portfolio/gestion_de_stock/stock1.png",
              "assets/img/portfolio/gestion_de_stock/stock2.png",
              "assets/img/portfolio/gestion_de_stock/stock3.png",
              "assets/img/portfolio/gestion_de_stock/stock4.png"
          ]
      },

      bourse: {
          titre: "Payement de Bourse",
          description: "Application desktop en Java",
          details:"Ce projet est l'accomplissement de mes études du langague JAVA pendant ma deuxième année. </br> Il s'agit d'une solution numérique visant à simplifier et à accélerer la distribution des bourses universitaire, elle automatise l'ensemble des taches facilitant la distribution. </br> Lien du code: <a href='https://github.com/SandaRakotomihamina/Gestion-de-payement-des-bourses-universitaires'>cliquer ici</a>",
          images: [
              "assets/img/portfolio/payement_des_bourses/bourse1.png",
              "assets/img/portfolio/payement_des_bourses/bourse2.png",
              "assets/img/portfolio/payement_des_bourses/bourse3.png",
              "assets/img/portfolio/payement_des_bourses/bourse4.png"
          ]
      },

      covoiturage: {
        titre: "Covoiturage",
        description: "Site en Symfony et Bootstrap",
        details:"Projet accadémique réalisé pour maitriser le concepte Interaction Homme-Machine, orrienté vèrs design et hergonomie pour facilité la manipulation des utilisateurs. </br> C'est une plateforme de covoiturage reliant des utilisateur de même itinéraire sur un même trajet. </br> Programé en Symfony, le code est lisible sur le lien: <a href='https://github.com/SandaRakotomihamina/Covoiturage'>cliquer ici</a> ",
        images: [
          "assets/img/portfolio/covoiturage/covoiturage1.png",
          "assets/img/portfolio/covoiturage/covoiturage2.png",
          "assets/img/portfolio/covoiturage/covoiturage3.png",
          "assets/img/portfolio/covoiturage/covoiturage4.png",
          "assets/img/portfolio/covoiturage/covoiturage5.png",
          "assets/img/portfolio/covoiturage/covoiturage6.png"
        ]
      },

      consultation: {
        titre: "Consultation médical",
        description: "Site en Symfony et Bootstrap pour la gendarmerie Toby RATSIMANDRAVA",
        details:"Projet de stage de fait d'année (L2) éffectué dans la branche DSIT/SEDI de la gendarmerie nationnal du toby RATSIMANDRAVA. </br> C'est une solution demander pour numeriser et sécuriser les données de consultation médical du personnel de la gendarmerie. Conçu pour un usage privé, mais une partie du code est visible sur github: <a href='https://github.com/SandaRakotomihamina/consultation-medicale'>cliquer ici</a>",
        images: [
          "assets/img/portfolio/consultation_medical/consultation1.png",
          "assets/img/portfolio/consultation_medical/consultation2.png",
          "assets/img/portfolio/consultation_medical/consultation3.png",
          "assets/img/portfolio/consultation_medical/consultation4.png"
        ]
      },

      rdv: {
        titre: "Rendez-vous médical",
        description: "Plateforme en JSP",
        details:"Projet accadémique en vu de l'apprentissage de la programmation web avec JAVA. </br> Ce plateforme permet aux utilisateur simple et aux médecins de conclure un rendez-vous professionnel dans le cade d'une consultation.</br> Le code a été publié sur github via ce lien: <a href='https://github.com/SandaRakotomihamina/Rendez-vous-m-dical'>cliquer ici</a>",
        images: [
          "assets/img/portfolio/rendez-vous_medical/rdv1.png",
          "assets/img/portfolio/rendez-vous_medical/rdv2.png",
          "assets/img/portfolio/rendez-vous_medical/rdv3.png",
          "assets/img/portfolio/rendez-vous_medical/rdv4.png",
          "assets/img/portfolio/rendez-vous_medical/rdv5.png",
          "assets/img/portfolio/rendez-vous_medical/rdv6.png"
        ]
      }
  };

  const params_portfolio = new URLSearchParams(window.location.search);
  const project = params_portfolio.get("project");

  if (projets[project]) {

      // infos texte
      document.getElementById("titre").textContent = projets[project].titre;
      document.getElementById("description").textContent = projets[project].description;
      document.getElementById('details').innerHTML = projets[project].details;

      let imgs = projets[project].images;
      const container = document.getElementById("project-img");
      container.innerHTML = "";

      // boucle forEach
      imgs.forEach(img => {

          const div = document.createElement("div");
          div.classList.add("swiper-slide");

          div.innerHTML = `
              <img src="${img}" class="img-fluid" alt="">
          `;

          container.appendChild(div);
      });

  }

  /*
    Script for portfolio-details
  */
  const services = {
    web: {
      titre: "Développement Web",
      titreLong: "Conception de Solutions Web Modernes",

      description: "Création d'applications web modernes et responsives.",

      descriptionLongue: "Je conçois des applications web modernes adaptées aux besoins spécifiques de chaque projet. Mon approche repose sur une architecture claire, une interface intuitive et une optimisation constante afin de garantir une expérience utilisateur fluide sur tous les appareils. Chaque solution développée vise à offrir performance, évolutivité et simplicité de maintenance.",

      details: "Développement avec HTML, CSS, JavaScript, PHP, Vue.js et Symfony.",

      detailsLongs: "Du site vitrine aux plateformes dynamiques plus complexes, je développe des solutions web robustes en utilisant les technologies les plus adaptées. J’accorde une importance particulière à la qualité du code, à la sécurité, à la modularité et à la compatibilité multi-support. L’objectif est toujours de fournir une application fiable, rapide et pensée pour évoluer dans le temps.",

      points: [
        "Interfaces responsives",
        "Applications dynamiques",
        "Architecture scalable"
      ]
    },

    mobile: {
      titre: "Développement Mobile",
      titreLong: "Applications Mobiles Performantes",

      description: "Applications mobiles Android.",

      descriptionLongue: "Je développe des applications mobiles conçues pour offrir fluidité, ergonomie et efficacité. Chaque interface est pensée pour répondre aux attentes des utilisateurs tout en garantissant une navigation intuitive et une excellente réactivité. Mon objectif est de produire des applications capables de fonctionner de manière stable même dans des contextes d’utilisation exigeants.",

      details: "Création d'applications mobiles performantes en Java et Python.",

      detailsLongs: "Le développement mobile exige rigueur et optimisation. J’accorde une attention particulière à la gestion des ressources, à la structure du projet et à la qualité de l’expérience utilisateur. Mes applications intègrent des fonctionnalités adaptées aux besoins réels tout en respectant les standards modernes de développement.",

      points: [
        "Applications Android",
        "Interface intuitive",
        "Performance optimisée"
      ]
    },

    data: {
      titre: "Gestion de Bases de Données",
      titreLong: "Structuration et Exploitation des Données",

      description: "Conception et optimisation de bases.",

      descriptionLongue: "La donnée est au cœur de tout système performant. Je conçois des bases de données structurées, cohérentes et évolutives capables de supporter efficacement les besoins métiers. Une bonne modélisation garantit non seulement la performance, mais aussi la fiabilité et la pérennité des applications qui s’y appuient.",

      details: "MySQL, PostgreSQL, SQLite et analyse de données.",

      detailsLongs: "Mon travail couvre la modélisation relationnelle, l’optimisation des requêtes, la sécurisation des accès et l’analyse des données. Je veille à concevoir des structures permettant une exploitation rapide et efficace des informations, tout en facilitant leur maintenance et leur évolution future.",

      points: [
        "Modélisation SQL",
        "Optimisation requêtes",
        "Analyse structurée"
      ]
    },

    systeme: {
      titre: "Administration Système et Réseaux",
      titreLong: "Infrastructure Stable et Sécurisée",

      description: "Maintenance et administration.",

      descriptionLongue: "Une infrastructure bien administrée garantit la stabilité et la continuité des services informatiques. J’interviens dans la configuration, la maintenance et l’optimisation des systèmes afin d’assurer leur bon fonctionnement et leur sécurité dans la durée.",

      details: "Configuration serveur, Linux, réseaux et sécurité.",

      detailsLongs: "Mon approche inclut l’administration de systèmes Linux, la gestion réseau, la supervision des performances et la mise en œuvre de bonnes pratiques de sécurité. L’objectif est de garantir des environnements fiables, performants et adaptés aux exigences techniques modernes.",

      points: [
        "Administration Linux",
        "Sécurité réseau",
        "Maintenance continue"
      ]
    },

    game: {
      titre: "Développement de Jeux Vidéo",
      titreLong: "Création d’Univers Interactifs",

      description: "Création de jeux interactifs.",

      descriptionLongue: "Le développement de jeux vidéo me permet de combiner créativité et logique algorithmique. Je conçois des expériences interactives engageantes en travaillant sur le gameplay, les mécaniques de jeu, les animations et l’interaction utilisateur.",

      details: "Développement de jeux avec Python / Pygame.",

      detailsLongs: "Chaque projet de jeu nécessite une réflexion poussée sur l’architecture, les performances et l’expérience utilisateur. Je développe des systèmes complets intégrant collisions, animations, logique événementielle et progression de jeu, tout en gardant une structure propre et évolutive.",

      points: [
        "Gameplay immersif",
        "Animations fluides",
        "Architecture interactive"
      ]
    },

    collab: {
      titre: "Collaboration et Partage",
      titreLong: "Travail Collaboratif et Transmission",

      description: "Travail collaboratif.",

      descriptionLongue: "Le développement informatique progresse grâce à l’échange et au partage des connaissances. Je suis convaincu que la collaboration permet d’atteindre des résultats plus solides et d’enrichir les compétences de chacun.",

      details: "Ouvert aux projets open source et collaborations.",

      detailsLongs: "Je reste ouvert aux collaborations techniques, aux projets collectifs et aux initiatives favorisant l’apprentissage mutuel. Le partage d’expérience, la revue de code et le travail en équipe sont pour moi des leviers essentiels pour progresser et produire des solutions de meilleure qualité.",

      points: [
        "Esprit d’équipe",
        "Partage technique",
        "Ouverture collaborative"
      ]
    }
  };

  // récupérer service depuis URL
  const params_service = new URLSearchParams(window.location.search);
  const service = params_service.get("service");

  if (service && services[service]) {

      // activer le bon lien
      const liens = document.querySelectorAll(".services-list a");

      liens.forEach(lien => {
          lien.classList.remove("active");

          if (lien.dataset.service === service) {
              lien.classList.add("active");
          }
      });

      // injecter les infos
      document.getElementById("service-titre").textContent = services[service].titre;
      document.getElementById("service-titre-long").textContent = services[service].titreLong;
      document.getElementById("service-description").textContent = services[service].description;
      document.getElementById("service-description-long").textContent = services[service].descriptionLongue;
      document.getElementById("service-description1").textContent = services[service].points[0];
      document.getElementById("service-description2").textContent = services[service].points[1];
      document.getElementById("service-description3").textContent = services[service].points[2];
      document.getElementById("service-detail").innerHTML = services[service].details;
      document.getElementById("service-detail-long").textContent = services[service].detailsLongs;

      console.log(services[service].details);
  }

})();