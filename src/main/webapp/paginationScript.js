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

//Display the initial 3 cards in the list
function initialDisplay() {
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
      resultsContent.appendChild(listingsArray[i]);
    }
  }
}  