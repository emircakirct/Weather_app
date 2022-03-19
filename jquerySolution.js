const form = $('form');
const input = $('input');
const msg = $('span.msg');
const list = $('ul');
localStorage.setItem(
  'apikey',
  EncryptStringAES('755ea7846cbde92f952243bf25f73a11')
);
form.on('submit', (e) => {
  e.preventDefault();
  getWeatherDetails();
});
$(document).ajaxStart(() => {
  let now = new Date();
  console.log(
    `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()} --> Ajax call started for '${input.val()}'`
  );
});
$(document).ajaxStop(() => {
  let now = new Date();
  console.log(
    `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()} --> Ajax call stoped for '${input.val()}'`
  );
});
$(document).ajaxSuccess((event, response, options, data) => {
  const { main, name, sys, weather } = data;
  const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
  const liItems = list.children().toArray();
  let cont = true;
  if (liItems.length > 0) {
    const found = liItems.forEach((theLi) => {
      if (theLi.querySelector('.city-name span').innerText == name) {
        msg.text(
          `You already know the weather for ${name}, Please search for another city :wink:`
        );
        cont = false;
      }
    });
  }
  if (cont) {
    list.prepend(
      $('<li>').append(`
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`)
    );
    $('.cities li').addClass('city');
  }
});
$(document).ajaxError((event, response, settings, error) => {
  console.log(error);
  msg.text(`The given city '${input.val()}' was not found.`);
});
$(document).ajaxComplete(() => {
  form[0].reset();
  input.focus();
});
const getWeatherDetails = () => {
  let apikey = DecryptStringAES(localStorage.getItem('apikey'));
  let inputVal = input.val();
  let weatherType = 'metric';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apikey}&units=${weatherType}`;
  $.get(url);
};