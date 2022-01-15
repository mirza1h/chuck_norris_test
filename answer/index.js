"use strict";

document.addEventListener("DOMContentLoaded", () => {
  var jokeInput = document.getElementById("idJokeInput");
  // Registers click handler for the 'Play with me!' button
  // Set max number for input and loads initial jokes
  function init() {
    document.getElementById("idPlayBtn").addEventListener("click", () => onBtnClicked());
    fetchJokesCount().then((count) => {
      jokeInput.max = count - 3;
    });
    loadRandomJokes();
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
    var jokeDivs = document.getElementById("jokesDiv").children;
    var count = 0;
    jokes.forEach((joke) => {
      jokeDivs[count++].innerHTML = joke;
    });
  }

  // Fetches one random joke object from API
  function fetchRandomJoke() {
    return new Promise((resolve, reject) => {
      fetchFromAPI('https://api.icndb.com/jokes/random/').then(value => resolve(value.joke));
    });
  }

  // Fetches one joke object by ID from API
  function fetchJokeById(id) {
    return new Promise((resolve, reject) => {
      fetchFromAPI(`https://api.icndb.com/jokes/${id}`).then(value => resolve(value.joke));
    });
  }

  // Fetches total number of jokes
  function fetchJokesCount() {
    return new Promise((resolve, reject) => {
      fetchFromAPI('https://api.icndb.com/jokes/count').then(value => resolve(value));
    });
  }

  // Fetches data from priveded URL and returns parsed object
  function fetchFromAPI(url) {
    return new Promise((resolve, reject) => {
      fetch(url).then(response => response.json()).then((data) => {
        resolve(data.value);
      }).catch((err) => {
        reject(err);
      });
    });

  }

  init();
});


