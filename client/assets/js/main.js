(function () {
  "use strict";

  const url = 'http://localhost:3030/api';

  let emptyMessage = document.getElementById('empty-message');

  etap1();
  etap2();
  etap3();
  showOrHideEmptyMsg();

  function etap1() {
    fetch(`${url}/categories`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          renderCategories(res.data.categories)
        }
      })
      .catch(error => console.log(error))

    function renderCategories(categories) {
      let categoriesUl = document.getElementById('categories-ul')
      for (let i = 0; i < categories.length; i++) {
        let li = document.createElement('li')
        li.setAttribute('data-filter', `.filter-${categories[i].en_name}`)
        li.textContent = `${categories[i].en_name}`
        categoriesUl.appendChild(li)
      }
    }
  }

  function etap2() {
    /**
   * Init isotope layout and filters
  */
    document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
        filters.addEventListener('click', function () {
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
  }

  function etap3() {
    fetch(`${url}/meals`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          renderMeals(res.data.meals);
        }
      })
      .catch(error => console.log(error));

    function renderMeals(meals) {
      let mainContainer = document.getElementById('meals-container');
      let mealsContainer = document.createElement('div');
      let mainCartContainer = document.getElementById('cart-container');
      let cartContainer = document.createElement('div');


      (function eachMeals(meals) {
        mealsContainer.classList.add("row", "isotope-container");
        mealsContainer.setAttribute('data-aos', 'fade-up');
        mealsContainer.setAttribute('data-aos-delay', '200');

        cartContainer.classList.add("row", "isotope-container");
        cartContainer.setAttribute('data-aos', 'fade-up');
        cartContainer.setAttribute('data-aos-delay', '200');
        cartContainer.id = 'cart-items'

        for (let i = 0; i < meals.length; i++) {
          renderingMeal(meals[i]);
        };
        mainContainer.appendChild(mealsContainer);
        mainCartContainer.appendChild(cartContainer);
      })(meals);

      function renderingMeal(meal) {
        // Cart item
        let isExist = Object.keys(localStorage).some(key => key.includes(`cart-item-${meal._id}`));

        if (isExist) {
          // Unhide ordering form
          // Cart item rendering.
          let cartItemDiv = document.createElement("div");
          cartItemDiv.classList.add("col-lg-6", "menu-item");
          // Adding id to cartItemDiv.
          cartItemDiv.setAttribute('id', `cart-item-${meal._id}`);
          let cartItemImg = document.createElement('img');
          cartItemImg.src = `${meal.image_url}`;
          cartItemImg.classList.add('menu-img');
          let divInCartItem = document.createElement('div');
          divInCartItem.classList.add('menu-content');
          let aCartItem = document.createElement('a');
          aCartItem.textContent = `${meal.en_name}`;
          let spanCartItem = document.createElement('span');
          spanCartItem.textContent = `$${meal.price}`;
          let divIn2CartItem = document.createElement('div');
          divIn2CartItem.classList.add('menu-ingredients', 'd-flex');
          divIn2CartItem.textContent = `${meal.en_description}`;
          // Cart item '-' button.
          let itemMinus = document.createElement('button');
          itemMinus.classList.add('btn-sm', 'ms-end', 'cart-item-minus-btn');
          let itemMinusText = document.createElement('p');
          itemMinusText.textContent = '-';
          itemMinus.appendChild(itemMinusText);
          itemMinus.addEventListener('click', () => {
            if (localStorage.getItem(`cart-item-${meal._id}`) != 1 || localStorage.getItem(`cart-item-${meal._id}`) > 1) {
              localStorage.setItem(`cart-item-${meal._id}`, `${Number(localStorage.getItem(`cart-item-${meal._id}`)) - 1}`)
              itemCount.textContent = `${localStorage.getItem(`cart-item-${meal._id}`)}`
            };
          });
          // Cart item count text.
          let itemCount = document.createElement('p');
          itemCount.classList.add('cart-item-count-text');
          itemCount.textContent = `${localStorage.getItem(`cart-item-${meal._id}`)}`;
          // Cart item '+' button.
          let itemPlus = document.createElement('button');
          itemPlus.classList.add('btn-sm', 'cart-item-plus-btn');
          let itemPlusText = document.createElement('p');
          itemPlusText.textContent = '+';
          itemPlus.appendChild(itemPlusText);
          itemPlus.addEventListener('click', () => {
            localStorage.setItem(`cart-item-${meal._id}`, `${Number(localStorage.getItem(`cart-item-${meal._id}`)) + 1}`);
            itemCount.textContent = `${localStorage.getItem(`cart-item-${meal._id}`)}`;
          });
          // Cart item remove button.
          let btnCartItem = document.createElement('button');
          btnCartItem.classList.add('btn-sm', 'ms-auto');
          let iconCartRemove = document.createElement('i');
          iconCartRemove.classList.add('bi', 'bi-cart-x-fill', 'cart-remove');
          btnCartItem.appendChild(iconCartRemove);
          btnCartItem.dataset.id = meal._id;
          btnCartItem.addEventListener('click', () => {
            // Remove cart item from localeStorage.
            localStorage.removeItem(`cart-item-${meal._id}`);
            // Remove item from cart.
            document.getElementById(`cart-item-${meal._id}`).remove();
            // Hide added-to-cart icon.
            document.getElementById(`checked-cart-${meal._id}`).style.display = 'none';
            // Unhide add-to-cart button.
            document.getElementById(`add-to-cart-${meal._id}`).style.display = '';
            // Show ro hide empty message.
            showOrHideEmptyMsg();
          });
          // AppendChild pieces.
          divInCartItem.appendChild(aCartItem);
          divInCartItem.appendChild(spanCartItem);
          divIn2CartItem.appendChild(itemMinus);
          divIn2CartItem.appendChild(itemCount);
          divIn2CartItem.appendChild(itemPlus);
          divIn2CartItem.appendChild(btnCartItem);
          cartItemDiv.appendChild(cartItemImg);
          cartItemDiv.appendChild(divInCartItem);
          cartItemDiv.appendChild(divIn2CartItem);
          cartContainer.appendChild(cartItemDiv);
          showOrHideEmptyMsg();
        }

        // Menu item
        let div = document.createElement("div");
        let filter = `filter-${meal.category.en_name}`;
        div.classList.add("col-lg-6", "menu-item", "isotope-item", filter);
        let img = document.createElement('img');
        img.src = `${meal.image_url}`;
        img.classList.add('menu-img');
        let divIn = document.createElement('div');
        divIn.classList.add('menu-content');
        let a = document.createElement('a');
        a.textContent = `${meal.en_name}`;
        let span = document.createElement('span');
        span.textContent = `$${meal.price}`;
        let divIn2 = document.createElement('div');
        divIn2.classList.add('menu-ingredients', 'd-flex');
        divIn2.textContent = `${meal.en_description}`;
        // Add to cart button.
        let btn = document.createElement('button');
        btn.classList.add('btn-sm', 'ms-auto');
        let iconCartPlus = document.createElement('i');
        iconCartPlus.classList.add('bi', 'bi-cart-plus-fill', 'cart-plus');
        btn.appendChild(iconCartPlus);
        btn.dataset.id = meal._id;
        btn.id = `add-to-cart-${meal._id}`;
        // Added to cart icon.
        let cartAdded = document.createElement('i');
        cartAdded.classList.add('bi', 'bi-cart-check-fill', 'ms-auto', 'checked-cart');
        cartAdded.id = `checked-cart-${meal._id}`;
        cartAdded.style.display = 'none';
        btn.style.display = 'none';
        btn.addEventListener('click', () => {
          let arr = [];
          for (let i = 0; i < localStorage.length; i++) {
            localStorage.key(i).includes('cart-item') ? arr.push(localStorage.key(i)) : false
          }
          if (arr.includes(`cart-item-${meal._id}`)) {
            false
          } else {
            localStorage.setItem(`cart-item-${meal._id}`, 1);
            // Hide add-to-cart button.
            btn.style.display = 'none';
            // Unhide added-to-cart icon.
            cartAdded.style.display = '';
            // Adding item to cart.
            let cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("col-lg-6", "menu-item", "isotope-item");
            // Adding id to cartItemDiv.
            cartItemDiv.setAttribute('id', `cart-item-${meal._id}`);
            let cartItemImg = document.createElement('img');
            cartItemImg.src = `${meal.image_url}`;
            cartItemImg.classList.add('menu-img');
            let divInCartItem = document.createElement('div');
            divInCartItem.classList.add('menu-content');
            let aCartItem = document.createElement('a');
            aCartItem.textContent = `${meal.en_name}`;
            let spanCartItem = document.createElement('span');
            spanCartItem.textContent = `$${meal.price}`;
            let divIn2CartItem = document.createElement('div');
            divIn2CartItem.classList.add('menu-ingredients', 'd-flex');
            divIn2CartItem.textContent = `${meal.en_description}`;
            // Cart item '-' button.
            let itemMinus = document.createElement('button');
            itemMinus.classList.add('btn-sm', 'ms-end', 'cart-item-minus-btn');
            let itemMinusText = document.createElement('p');
            itemMinusText.textContent = '-';
            itemMinus.appendChild(itemMinusText);
            itemMinus.addEventListener('click', () => {
              if (localStorage.getItem(`cart-item-${meal._id}`) != 1 || localStorage.getItem(`cart-item-${meal._id}`) > 1) {
                localStorage.setItem(`cart-item-${meal._id}`, `${Number(localStorage.getItem(`cart-item-${meal._id}`)) - 1}`)
                itemCount.textContent = `${localStorage.getItem(`cart-item-${meal._id}`)}`
              }
            });
            // Cart item count text.
            let itemCount = document.createElement('p');
            itemCount.classList.add('cart-item-count-text');
            itemCount.textContent = `${localStorage.getItem(`cart-item-${meal._id}`)}`;
            // Cart item '+' button.
            let itemPlus = document.createElement('button');
            itemPlus.classList.add('btn-sm', 'cart-item-plus-btn');
            let itemPlusText = document.createElement('p');
            itemPlusText.textContent = '+';
            itemPlus.appendChild(itemPlusText);
            itemPlus.addEventListener('click', () => {
              localStorage.setItem(`cart-item-${meal._id}`, `${Number(localStorage.getItem(`cart-item-${meal._id}`)) + 1}`)
              itemCount.textContent = `${localStorage.getItem(`cart-item-${meal._id}`)}`
            });
            // Cart item remove button.
            let btnCartItem = document.createElement('button');
            btnCartItem.classList.add('btn-sm', 'ms-auto');
            let iconCartRemove = document.createElement('i');
            iconCartRemove.classList.add('bi', 'bi-cart-x-fill', 'cart-remove');
            btnCartItem.appendChild(iconCartRemove);
            btnCartItem.dataset.id = meal._id;
            btnCartItem.addEventListener('click', () => {
              // Remove cart item from localeStorage.
              localStorage.getItem(`cart-item-${meal._id}`) ? localStorage.removeItem(`cart-item-${meal._id}`) : false;
              // Remove item from cart.
              document.getElementById(`cart-item-${meal._id}`).remove();
              // Hide added-to-cart icon.
              document.getElementById(`checked-cart-${meal._id}`).style.display = 'none';
              // Unhide add-to-cart button.
              document.getElementById(`add-to-cart-${meal._id}`).style.display = '';
              // Show or hide empty message.
              showOrHideEmptyMsg();
            });
            // AppendChild pieces.
            divInCartItem.appendChild(aCartItem);
            divInCartItem.appendChild(spanCartItem);
            divIn2CartItem.appendChild(itemMinus);
            divIn2CartItem.appendChild(itemCount);
            divIn2CartItem.appendChild(itemPlus);
            divIn2CartItem.appendChild(btnCartItem);
            cartItemDiv.appendChild(cartItemImg);
            cartItemDiv.appendChild(divInCartItem);
            cartItemDiv.appendChild(divIn2CartItem);
            cartContainer.appendChild(cartItemDiv);
          };
          showOrHideEmptyMsg();
        });
        if (localStorage.getItem(`cart-item-${meal._id}`)) {
          cartAdded.style.display = '';
        } else {
          btn.style.display = '';
        }
        divIn.appendChild(a);
        divIn.appendChild(span);
        divIn2.appendChild(cartAdded);
        divIn2.appendChild(btn);
        div.appendChild(img);
        div.appendChild(divIn);
        div.appendChild(divIn2);
        mealsContainer.appendChild(div);
      };
    }
  }

  document.querySelector('.order-form').addEventListener('submit', function (event) {
    event.preventDefault();

    let thisForm = this;

    let action = `${url}/order/create`;

    thisForm.querySelector('.loading').classList.add('d-block');
    thisForm.querySelector('.error-message').classList.remove('d-block');
    thisForm.querySelector('.sent-message').classList.remove('d-block');

    let formData = new FormData(thisForm);

    let jsonObject = {};
    formData.forEach((value, key) => jsonObject[key] = value);

    let meals = [];
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).includes('cart-item')) {
        let orderMeal = {};
        let key = localStorage.key(i);
        orderMeal.mealId = key.split('-')[2];
        orderMeal.amount = Number(localStorage.getItem(key));
        meals.push(orderMeal);
      };
    }
    jsonObject.meals = meals;

    ordering(thisForm, action, jsonObject);
  });

  function ordering(thisForm, action, jsonData) {
    fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    })
      .then(response => response.json())
      .then(response => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (response.success == true) {
          document.querySelector('#order-form input[name=customer_name]').setAttribute('type', 'hidden');
          document.querySelector('#order-form input[name=customer_name]').removeAttribute('class');
          document.querySelector('#order-form input[name=email]').setAttribute('type', 'hidden');
          document.querySelector('#order-form input[name=email]').removeAttribute('class');
          document.querySelector('#order-form input[name=phone]').setAttribute('type', 'hidden');
          document.querySelector('#order-form input[name=phone]').removeAttribute('class');
          document.getElementById('container-ordering').style.display = 'none';
          document.getElementById('order-submit').style.display = 'none';
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
          document.getElementById('cart-items').remove();
          clearLocaleStorageAndCartItems();
        } else {
          throw new Error(response.error.message);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function clearLocaleStorageAndCartItems() {
    let keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      localStorage.key(i).includes('cart-item-') ? keys.push(localStorage.key(i)) : false;
    }
    keys.forEach(key => localStorage.removeItem(key));
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

  function showOrHideEmptyMsg() {
    let localStorageKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key && key.includes('cart-item')) {
        localStorageKeys.push(key);
      }
    }
    emptyMessage.style.display = localStorageKeys.length === 0 ? '' : 'none';
    document.querySelector('.order-form').style.display = localStorageKeys.length === 0 ? 'none' : '';
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
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
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
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

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