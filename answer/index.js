"use strict";

function init() {
  loadJokes();
}

function onBtnClicked() {
  loadJokes();
}

function loadJokes() {
  fetchRandomJoke().then((joke) => { document.getElementById("yellow").innerHTML = joke });
  fetchRandomJoke().then((joke) => { document.getElementById("blue").innerHTML = joke });
  fetchRandomJoke().then((joke) => { document.getElementById("green").innerHTML = joke });
}

function fetchRandomJoke() {
  return new Promise((resolve, reject) => {
    fetch('https://api.icndb.com/jokes/random/').then(response => response.json()).then((data) => {
      resolve(data.value.joke);
    }).catch((err) => {
      reject(err);
    });
  });
}

init();

