// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const alertMessage = 'Sorry! We cannot geolocate you. Please enter a zipcode';
let map;

function getGeolocation() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocation, displayError);
  }
  else {
    console.log('Browser does not support geolocation');
    alert(alertMessage);
  }
}

function displayLocation(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  fetchList('/data?lat=' + lat + "&lng=" + lng);
}

function displayError() {
  console.log('Geolocation not enabled');
  alert(alertMessage);
}

function getZipCode() {
  let zip = document.getElementById('zipCode').value;
  fetchList('/data?zipCode=' + zip);
}

//Array of the (currently 6 for this demo build) 15 listings gathered from the fetch request
let resultsCardsArray = [];

//Count of the total businesses in the fetch request, used to set a unique id for each card
let totalCardCount = 0;
let bounds = 0;

function fetchList(queryString) {
  initiateLoaderCircle();
  bounds = new google.maps.LatLngBounds();
  fetch(queryString).then(response => response.json()).then((listings) => {
    resultsCardsArray = [];
    totalCardCount = 0;
    initMap(listings[0].mapLocation);
    listings.forEach((listing) => {
      resultsCardsArray.push(createResultCard(listing.name, listing.formattedAddress, 
            listing.photos, listing.rating, listing.url, totalCardCount));

      if (totalCardCount < 15) createMarker(listing, totalCardCount);
      totalCardCount++;
    }); 
    initialDisplay();
    map.fitBounds(bounds);  
    removeLoaderCircle();
  });
}

// Style elements being alterned by loader
let loaderCircleElement = document.getElementById('loader-circle');
let loaderCircleContainerElement = document.getElementById('loader-circle-container');
let mapElement = document.getElementById('map');

function initiateLoaderCircle() {
  loaderCircleElement.className = 'loader-circle-display';
  loaderCircleContainerElement.className = 'loader-circle-display';
  mapElement.className = 'map-transparent';
}

function removeLoaderCircle() {
  loaderCircleElement.className = 'loader-circle-hide';
  loaderCircleContainerElement.className = 'loader-circle-hide';
  mapElement.className = 'map-opaque';
}

/**
 * @param {string} name The name of the business
 * @param {string} address The address of the business
 * @param {string} image The url of the business image
 * @param {double} rating The numerical rating of the business, passed to the createRating() function
 * @param {string} websiteUrl The url of the business' website
 * @param {int} totalCardCount The number of businesses in the list, used to set a specific id to each card
 */
function createResultCard(name, address, photos, rating, websiteUrl, totalCardCount) {
  const resultsCard = document.createElement('div');
  resultsCard.className = 'results-card';
  resultsCard.id = totalCardCount;

  const imageDiv = document.createElement('div');
  imageDiv.className = 'results-image';

  const imageElement = document.createElement('img');
  imageElement.id = 'results-image-element';

  let resultPhotoReference = '';
  if ((photos != null) && (photos.length > 0)) {
    resultPhotoReference = photos[0].photoReference;
  }
  else {
    resultPhotoReference = 'none';
  }

  imageDiv.appendChild(imageElement);

  const nameHeader = document.createElement('h2');
  nameHeader.innerText = name;

  const addressParagraph = document.createElement('p');
  addressParagraph.innerText = address;

  const nameAndAddressDiv = document.createElement('div');
  nameAndAddressDiv.className = 'results-business-description';
  nameAndAddressDiv.appendChild(nameHeader);
  nameAndAddressDiv.appendChild(addressParagraph);

  const ratingDiv = createRating(rating);

  const websiteButton = document.createElement('button');
  websiteButton.className = 'results-website-button';
  if (websiteUrl.includes('maps.google.com')) {
    websiteButton.innerText = 'Visit Location on Google Maps';
    linkWebsite(websiteUrl, websiteButton);
  }
  else if (websiteUrl === '') {
    websiteButton.innerText = 'Website Unavailable';
    websiteButton.className = 'unavailable-website';
  }
  else {
    websiteButton.innerText = 'Visit Website';
    linkWebsite(websiteUrl, websiteButton);
  }
    

  resultsCard.appendChild(imageDiv);
  resultsCard.appendChild(nameAndAddressDiv);
  resultsCard.appendChild(ratingDiv);
  resultsCard.appendChild(websiteButton);

  //Creates object that contains the resultCard and photoReference to append to array
  let resultsCardObject = {
    card: resultsCard,
    photoReference: resultPhotoReference
  };

  return resultsCardObject;
}

function linkWebsite(websiteUrl, websiteButton) {
  // Equivalent to HTML's 'onClick'
  websiteButton.addEventListener('click', function() {
    window.open(websiteUrl);
  });
}

/**
 * @param {double} rating The numerical rating for the business, determins the number of stars
 */
function createRating(rating) {
  const ratingDiv = document.createElement('div');
  ratingDiv.className = 'results-rating';

  let roundedRating = Math.round(rating);

  for(i = 0; i < roundedRating; i++) {
    ratingDiv.innerText += '★';
  }

  for (i = roundedRating; i < 5; i++) {
    ratingDiv.innerText += '☆';
  }

  ratingDiv.innerText += (' ' + rating.toFixed(1));
  
  return ratingDiv;
}
