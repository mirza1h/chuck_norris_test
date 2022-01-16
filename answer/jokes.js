"use strict";
document.addEventListener("DOMContentLoaded", () => {
  var jokeInput = document.getElementById("jokeIDInput");

  // Registers event handlers
  // Sets max number for input and loads initial jokes
  function init() {
    registerEventHandlers();
    fetchJokesCount().then((count) => {
      jokeInput.disabled = false;
      jokeInput.max = count - 3;
    });
    loadRandomJokes();
  }

  // Adds 'click' event handler
  function registerEventHandlers() {
    document.getElementById("playBtn").addEventListener("click", () => onBtnClicked());
  }

  // Event handler for button 'click' event
  // Decides and calls appropriate method for loading jokes
  // Checks input validity if necessarry
  function onBtnClicked() {
    var jokeID = jokeInput.value;
    if (jokeID) {
      if (jokeInput.checkValidity())
        loadJokesById(jokeID);
      else
        jokeInput.reportValidity();
    }
    else
      loadRandomJokes();
  }

  // Fetches 3 jokes with consecutive IDs and sets them to divs
  function loadJokesById(jokeID) {
    Promise.all([fetchJokeById(jokeID++), fetchJokeById(jokeID++), fetchJokeById(jokeID++)]).then(
      (jokes) => { setJokes(jokes); }
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
      }
      else
        setJokes(setOfJokes);
    }
    keepFetching();
  }

  // Populates divs with jokes
  function setJokes(jokes) {
    var count = 0;
    var allDivs = Array.from(document.getElementById("tileContainer").children);
    var jokeDivs = allDivs.filter(div => div.id !== 'red');
    jokes.forEach((joke) => { jokeDivs[count++].innerHTML = joke; });
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

  init();
});


