"use strict";
document.addEventListener("DOMContentLoaded", () => {
  var jokeInput = document.getElementById("jokeIDInput");
  var allTiles = document.getElementById("tileContainer");
  var allDivs = Array.from(allTiles.children);

  // Registers event handlers
  // Set max number for input and loads initial jokes
  function init() {
    registerEventHandlers(allDivs, true);
    fetchJokesCount().then((count) => { jokeInput.max = count - 3; });
    loadRandomJokes();
  }

  // Adds 'click' and drag event handlers
  function registerEventHandlers(divs, registerClickEvent) {
    if (registerClickEvent) {
      document.getElementById("playBtn").addEventListener("click", () => onBtnClicked());
    }
    divs.forEach(div => div.addEventListener("dragstart", (event) => onDragStart(event)));
    divs.forEach(div => div.addEventListener("drop", (event) => onDrop(event)));
    divs.forEach(div => div.addEventListener("dragover", (event) => onDragOver(event)));
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
    var jokeDivs = allDivs.filter(div => div.id !== 'red');
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

  // Capture ID of dragged tile
  function onDragStart(event) {
    event.dataTransfer.setData("sourceID", event.target.id);
  }

  // Switch the position of source and target tile
  // Re-register event handlers because by creating a new reference we lose them
  function onDrop(event) {
    event.preventDefault();
    var sourceTile = document.getElementById(event.dataTransfer.getData("sourceID"));
    var targetTile = document.getElementById(event.target.id);
    if (sourceTile !== targetTile) {
      var targetTileClone = targetTile.cloneNode(true);
      var dragIndex = getIndexWithinParent(sourceTile);
      switchPositions(sourceTile, targetTileClone);
      allTiles.replaceChild(sourceTile, targetTile);
      allTiles.insertBefore(targetTileClone, allTiles.childNodes[dragIndex]);
      allTiles = document.getElementById("tileContainer");
      allDivs = Array.from(allTiles.children);
      registerEventHandlers([targetTileClone], targetTile.id === 'red' ? true : false);
    }
  }

  // Switch CSS class (position) of elements
  function switchPositions(sourceTile, targetTile) {
    var sourceTileOriginalPosition = sourceTile.classList[0];
    if (sourceTileOriginalPosition != targetTile.classList[0]) {
      sourceTile.classList.replace(sourceTileOriginalPosition, targetTile.classList[0]);
      targetTile.classList.replace(targetTile.classList[0], sourceTileOriginalPosition);
    }
  }

  // Returns index of node within parent node
  function getIndexWithinParent(node) {
    return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  }

  // Cancel the default action for 'dragover' in order for 'drop' event to fire
  function onDragOver(event) {
    event.preventDefault();
  }

  init();
});


