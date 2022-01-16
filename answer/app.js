"use strict";

document.addEventListener("DOMContentLoaded", () => {
  var jokeInput = document.getElementById("idJokeInput");
  var jokeDivs = document.getElementById("jokesDiv").children;

  // Registers event handlers
  // Set max number for input and loads initial jokes
  function init() {
    registerEventHandlers(onBtnClicked, jokeDivs, onDragEnd);
    fetchJokesCount().then((count) => { jokeInput.max = count - 3; });
    loadRandomJokes();
  }

  // Adds 'click' and 'dragend' event handlers
  function registerEventHandlers(onBtnClicked, jokeDivs, onDragEnd) {
    document.getElementById("idPlayBtn").addEventListener("click", () => onBtnClicked());
    const allDivs = document.getElementsByClassName('tile');
    Array.from(allDivs).forEach(div => div.addEventListener("dragend", (event) => onDragEnd(event)));
  }

  // Event handler for button 'click' event
  // Decides and calls appropriate method for loading jokes
  // Checks input validity if necessarry
  function onBtnClicked() {
    var jokeID = jokeInput.value;
    if (jokeID) {
      if (jokeInput.checkValidity())
        loadJokesById(jokeID);
      else {
        jokeInput.reportValidity();
      }
    }
    else {
      loadRandomJokes();
    }
  }

  // Fetches 3 jokes with consecutive IDs and sets them to divs
  function loadJokesById(jokeID) {
    Promise.all([fetchJokeById(jokeID++), fetchJokeById(jokeID++), fetchJokeById(jokeID++)]).then(
      (jokes) => {
        setJokes(jokes);
      }
    )
  }

  // Keeps fetching jokes until 3 unique jokes are loaded and then sets them to divs
  // NOTE: API provides a way to get any number of unique random jokes (http://api.icndb.com/jokes/random/<number>)
  // but task description seems to require use of https://api.icndb.com/jokes/random/
  function loadRandomJokes() {
    var setOfJokes = new Set();
    var keepFetching = function () {
      if (setOfJokes.size < 3) {
        fetchRandomJoke().then((joke) => {
          setOfJokes.add(joke);
          keepFetching();
        });
      } else {
        setJokes(setOfJokes);
      }
    }
    keepFetching();
  }

  // Populates divs with jokes
  function setJokes(jokes) {
    var count = 0;
    jokes.forEach((joke) => {
      jokeDivs[count++].innerHTML = joke;
    });
  }

  // Fetches one random joke object from API
  function fetchRandomJoke() {
    return new Promise((resolve) => {
      fetchFromAPI('https://api.icndb.com/jokes/random/').then(value => resolve(value.joke));
    });
  }

  // Fetches one joke object by ID from API
  function fetchJokeById(id) {
    return new Promise((resolve) => {
      fetchFromAPI(`https://api.icndb.com/jokes/${id}`).then(value => resolve(value.joke));
    });
  }

  // Fetches total number of jokes
  function fetchJokesCount() {
    return new Promise((resolve) => {
      fetchFromAPI('https://api.icndb.com/jokes/count').then(value => resolve(value));
    });
  }

  // Fetches data from provided URL and returns parsed object
  function fetchFromAPI(url) {
    return new Promise((resolve, reject) => {
      fetch(url).then(response => response.json()).then((data) => {
        resolve(data.value);
      }).catch((err) => {
        alert(err.message);
        reject();
      });
    });
  }

  // Event handler for button 'dragend' event
  // Swaps selected and target tile
  function onDragEnd(event) {
    swapTiles(event.target, getTargetTile(event));
  }

  // Get the tile element positioned at the coordinates where 'dragend' event finished
  function getTargetTile(event) {
    var element = document.elementFromPoint(event.clientX, event.clientY);
    if (element && element.draggable)
      return element;
    else {
      return event.target;
    }
  }

  // Swap content and classes of selected tile with target tile
  function swapTiles(selectedTile, targetTile) {
    selectedTile.classList.replace('right', 'left');
    selectedTile.classList.replace('left', 'right');
    var tempTile = selectedTile.cloneNode(true);
    targetTile.classList.replace('right', 'left');
    targetTile.classList.replace('left', 'right');
    var tempTargetTile = targetTile.cloneNode(true);
    targetTile.innerHTML = tempTile.innerHTML;
    targetTile.classList = tempTile.classList;
    selectedTile.innerHTML = tempTargetTile.innerHTML;
    selectedTile.classList = tempTargetTile.classList;
  }

  init();
});


