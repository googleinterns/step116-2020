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

//Div that contains the result cards
const resultsContent = document.getElementById('results-content');
resultsContent.className = 'results-content';

const resultsChildren = resultsContent.childNodes;

const TOTAL_CARDS_TO_DISPLAY = 3;
const MAX_LIST_VIEW_NUMBER = 15;

const WEBSITE_BUTTON_TEXT = 'Visit Website';
const MAPS_BUTTON_TEXT = 'Visit Location on Google Maps';
const UNAVAILABLE_BUTTON_TEXT = 'Website Unavailable';

const KEY = 'REDACTED';

//Display the initial 3 cards in the list
function initialDisplay() {
  resultsContent.innerHTML = '';
  displayCards(0);
}

//Navigate back one page (3 results) in the list view
function navigatePrevious() {
  displayCards((-TOTAL_CARDS_TO_DISPLAY));
}

//Move forward one page (3 results) in the list view
function moveNext() {
  displayCards(TOTAL_CARDS_TO_DISPLAY);
}

//Handles the actual loop through array and display of cards
function displayCards(listAugment) {
  let currentFirstCardIndex = 0;

  if (resultsChildren.length != 0) {
    currentFirstCardIndex = parseInt(resultsChildren[0].id);
  }

  if ((currentFirstCardIndex == 0) && (listAugment < 0)) {
    alert('Already at beginning of list!');
  }
  else if (currentFirstCardIndex == (MAX_LIST_VIEW_NUMBER - TOTAL_CARDS_TO_DISPLAY) && (listAugment > 0)) {
    alert('Already at end of list!');
  }
  else {
    currentFirstCardIndex += listAugment; 

    resultsContent.innerHTML = '';
    for (let i = currentFirstCardIndex; i < (currentFirstCardIndex + TOTAL_CARDS_TO_DISPLAY); i++) {
      //Card being appended to the resultsContent div
      let cardToAppend = resultsCardsArray[i];

      //The actual image element to which the image src will be applied
      let resultsImageElement = locateImageElement(cardToAppend.card);

      if (cardToAppend.photoReference != 'none') {
        loadImage(resultsImageElement, cardToAppend.photoReference);
      }

      let websiteButtonElement = locateWebsiteUrlElement(cardToAppend.card);
      loadWebsiteUrl(websiteButtonElement, cardToAppend.placeId);

      resultsContent.appendChild(cardToAppend.card);
    }
  }
}  

function locateImageElement(card) {
  let cardChildren = card.childNodes;
  let child = 0;

  while (cardChildren[child].className != 'results-image') {
    child++;
  }

  return cardChildren[child].getElementsByTagName('img')[0];
}

function loadImage(listingImage, photoReference) {
  let maxwidth = 400;

  listingImage.src = 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' 
        + photoReference + '&key=' + KEY + '&maxwidth=' + maxwidth;
}

function locateWebsiteUrlElement(card) {
  return card.getElementsByClassName('results-website-button')[0];
}

function loadWebsiteUrl(websiteButtonElement, passedPlaceId) {
  let request = {
    placeId: passedPlaceId,
    fields: ['website', 'url']
  };
  
  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, function(place, status) {
  
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      if (place.website != null) {
        websiteUrl = place.website;
        websiteButtonElement.innerText = WEBSITE_BUTTON_TEXT;
        linkWebsite(websiteUrl, websiteButtonElement);
      }
      else {
        websiteUrl = place.url;
        websiteButtonElement.innerText = MAPS_BUTTON_TEXT;
        linkWebsite(websiteUrl, websiteButtonElement);
      }
    }
    else {
      websiteButtonElement.innerText = UNAVAILABLE_BUTTON_TEXT;
      websiteButtonElement.className = 'unavailable-website';
    }
  });
}

function linkWebsite(websiteUrl, websiteButton) {
  // Equivalent to HTML's 'onClick'
  websiteButton.addEventListener('click', function() {
    window.open(websiteUrl);
  });
}