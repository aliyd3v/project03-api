(function () {
  "use strict";

  const url = 'http://localhost:3030/api'

  let selectTableForm = document.querySelectorAll('.select-table-form')
  let forms = document.querySelectorAll('.php-email-form');
  let tablesContainer = document.getElementById('tables')
  let bookingForm = document.getElementById('bookingForm')
  bookingForm.style.display = 'none'
  let next2Container = document.getElementById('next2-container')
  next2Container.style.display = 'none'
  let next2Button = document.getElementById('next2')


  selectTableForm.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = `${url}/booking/availability`;

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      let jsonObject = {};
      formData.forEach((value, key) => jsonObject[key] = value);

      select_table_form_submit(thisForm, action, jsonObject);
    });
  });

  function select_table_form_submit(thisForm, action, jsonData) {
    fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    })
      .then(response => response.json())
      .then(response => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (response.success == true) {
          document.getElementById('booking-form').style.display = 'none'
          renderTables(response.data.available_stols, response.data.allStolsLength)
          next2Container.style.display = ''
          document.getElementById('date-for-booking').setAttribute('value', thisForm.date.value)
          document.getElementById('time-for-booking').setAttribute('value', thisForm.time.value)
          document.getElementById('hour-for-booking').setAttribute('value', thisForm.hour.value)
          thisForm.reset();
        } else {
          throw new Error(response.error.message);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function renderTables(availableTables, allStolsLength) {
    tablesContainer.innerHTML = "";
    for (let i = 1; i <= allStolsLength; i++) {
      availableTables.includes(i) ? renderingAvailableTable(i) : renderingOccupiedTable(i)
    }
    function renderingAvailableTable(tableId) {
      let div = document.createElement("div");
      div.classList.add("table-box", "available");
      div.dataset.id = tableId;
      div.textContent = `${tableId}`;
      div.addEventListener("click", function () {
        document.querySelectorAll(".table-box").forEach(t => t.classList.remove("selected"));
        div.classList.add("selected");
        next2Button.removeAttribute('disabled')
        next2Button.style.cursor = "pointer";
      });
      tablesContainer.appendChild(div);
    };
    function renderingOccupiedTable(tableId) {
      let div = document.createElement("div");
      div.classList.add("table-box", "occupied");
      div.dataset.id = tableId;
      div.textContent = `${tableId}`;
      tablesContainer.appendChild(div);
    };

  }

  next2Button.addEventListener('click', function () {
    let selectedTable = document.querySelector('.selected').getAttribute('data-id')
    document.getElementById('stol-for-booking').setAttribute('value', selectedTable)
    tablesContainer.style.display = 'none'
    tablesContainer.removeAttribute('class')
    next2Container.style.display = 'none'
    bookingForm.style.display = ''
  })

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = `${url}/booking/create`;

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      let jsonObject = {};
      formData.forEach((value, key) => jsonObject[key] = value);

      php_email_form_submit(thisForm, action, jsonObject);
    });
  });

  function php_email_form_submit(thisForm, action, jsonData) {
    fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    })
      .then(response => response.json())
      .then(response => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (response.success == true) {
          document.querySelector('#bookingForm input[name=customer_name]').setAttribute('type', 'hidden')
          document.querySelector('#bookingForm input[name=customer_name]').removeAttribute('class')
          document.querySelector('#bookingForm input[name=email]').setAttribute('type', 'hidden')
          document.querySelector('#bookingForm input[name=email]').removeAttribute('class')
          document.querySelector('#bookingForm input[name=phone]').setAttribute('type', 'hidden')
          document.querySelector('#bookingForm input[name=phone]').removeAttribute('class')
          document.getElementById('container-bookingForm').style.display = 'none'
          document.getElementById('lastBookingButton').style.display = 'none'
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(response.error.message);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();