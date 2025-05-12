(function () {
  "use strict";

  let tableSection = document.getElementById('table');
  tableSection.style.display = 'none';

  let orderSection = document.getElementById('order');
  orderSection.style.display = 'none';

  let errorSection = document.getElementById('error');
  errorSection.style.display = 'none';

  const url = 'http://localhost:3030/api';

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  fetch(`${url}/verify/email-verification?token=${token}`)
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        if (res.data.table) {
          tableSection.style.display = ''
          document.getElementById('date-and-time').textContent = `${res.data.booking.date} ${res.data.booking.time}`
          document.getElementById('customer-phone').textContent = `${res.data.booking.phone}`
          document.getElementById('customer-email').textContent = `${res.data.booking.email}`
          document.getElementById('table-number').textContent = `Table number ${res.data.table} for ${res.data.booking.hour} hour(s)`
        };
        if (res.data.meals) {
          orderSection.style.display = '';
          renderMeals(res.data.meals);
        };
      } else {
        errorSection.style.display = ''
        document.getElementById('error-message').textContent = `${res.error.message}`
      };
    })
    .catch(err => {
      errorSection.style.display = ''
      document.getElementById('error-message').textContent = `${err}`
    });


  function renderMeals(meals) {
    let mainCartContainer = document.getElementById('order-itmes-container');
    let cartContainer = document.createElement('div');


    (function eachMeals(meals) {
      cartContainer.classList.add("row", "isotope-container");
      cartContainer.setAttribute('data-aos', 'fade-up');
      cartContainer.setAttribute('data-aos-delay', '200');
      cartContainer.id = 'cart-items'

      for (let i = 0; i < meals.length; i++) {
        renderingMeal(meals[i]);
      };
      mainCartContainer.appendChild(cartContainer);
    })(meals);

    function renderingMeal(data) {
      // Cart item
      let cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("col-lg-6", "menu-item");
      let cartItemImg = document.createElement('img');
      cartItemImg.src = `${data.meal.image_url}`;
      cartItemImg.classList.add('menu-img');
      let divInCartItem = document.createElement('div');
      divInCartItem.classList.add('menu-content');
      let aCartItem = document.createElement('a');
      aCartItem.textContent = `${data.meal.en_name}`;
      let spanCartItem = document.createElement('span');
      spanCartItem.textContent = `$${data.meal.price}`;
      let divIn2CartItem = document.createElement('div');
      divIn2CartItem.classList.add('menu-ingredients', 'd-flex');
      divIn2CartItem.textContent = `${data.meal.en_description}`;
      // Cart item count text.
      let itemCount = document.createElement('p');
      itemCount.classList.add('cart-item-count-text');
      itemCount.textContent = data.amount;
      // AppendChild pieces.
      divInCartItem.appendChild(aCartItem);
      divInCartItem.appendChild(spanCartItem);
      divIn2CartItem.appendChild(itemMinus);
      divIn2CartItem.appendChild(itemCount);
      divIn2CartItem.appendChild(itemPlus);
      cartItemDiv.appendChild(cartItemImg);
      cartItemDiv.appendChild(divInCartItem);
      cartItemDiv.appendChild(divIn2CartItem);
      cartContainer.appendChild(cartItemDiv);
    };
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
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
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
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
  window.addEventListener('load', function (e) {
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

})();