const $ = window.$;

/* Run script only after page is done loading */
$(document).ready(() => {
  /* get all input tags */
  const checkboxes = $('input[type=checkbox]');
  /* amenities h4 */
  const preferences = $('.preferences');
  /* list to hold the amenity id(s) */
  const amenityIds = [];
  /* list to hold the aminities to be added to the h4 .preferences */
  const addToH4 = [];

  /* detect change on checkbox */
  $(checkboxes).change(() => {
    /* iterate through the list of inputs */
    $(checkboxes).each((index) => {
      /* add to AmenityIds list and addToH4 list && remove from AmenityIds list and remove from addToH4 list */
      if ($(checkboxes[index]).prop('checked') && amenityIds.indexOf($(checkboxes[index]).attr('data-id')) === -1 && addToH4.indexOf($(checkboxes[index]).attr('data-name')) === -1) {
        amenityIds.push($(checkboxes[index]).attr('data-id'));
        addToH4.push($(checkboxes[index]).attr('data-name'));
        console.log(amenityIds);
      } else if ($(checkboxes[index]).prop('checked') === false && amenityIds.indexOf($(checkboxes[index]).attr('data-id')) > -1 && addToH4.indexOf($(checkboxes[index]).attr('data-name')) > -1) {
        amenityIds.splice(amenityIds.indexOf(amenityIds[index]), 1);
        addToH4.splice(addToH4.indexOf(addToH4[index]), 1);
        console.log(amenityIds);
      }

      /* concatinate all preferences in addToH4 as string */
      let str = '';
      $(addToH4).each((i) => {
        str = str + ' ' + addToH4[i] + ',';
      });

      /* change the amenity h4 text */
      preferences.text(str);
    });
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', (data, status) => {
    if (status) {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: '{}',
    success: (data) => {
      $(data).each((place) => {
        const article = '<ARTICLE></ARTICLE>';
        const title = `<div class="title_box"><h2>${data[place].name}</h2><div class="price_by_night">$${data[place].price_by_night}</div></div>`;
        const information = `<div class="information"><div class="max_guest">${data[place].max_guest} Guests</div><div class="number_rooms">${data[place].number_rooms} Bedrooms</div><div class="number_bathrooms">${data[place].number_bathrooms} Bathrooms</div></div>`;
        const description = `<div class="description">${data[place].description}</div>`;
        const html = title + information + description;
        $('SECTION.places').append($(article).append(html));
      });
    },
    contentType: 'application/json',
    dataType: 'json'
  });

  $('button').click(() => {
    $('SECTION.places').empty();
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({ amenities: amenityIds }),
      success: (data) => {
        $(data).each((place) => {
          const article = '<ARTICLE></ARTICLE>';
          const title = `<div class="title_box"><h2>${data[place].name}</h2><div class="price_by_night">$${data[place].price_by_night}</div></div>`;
          const information = `<div class="information"><div class="max_guest">${data[place].max_guest} Guests</div><div class="number_rooms">${data[place].number_rooms} Bedrooms</div><div class="number_bathrooms">${data[place].number_bathrooms} Bathrooms</div></div>`;
          const description = `<div class="description">${data[place].description}</div>`;
          const html = title + information + description;
          $('SECTION.places').append($(article).append(html));
          console.log(place);
        });
      },
      contentType: 'application/json',
      dataType: 'json'
    });
  });
});
