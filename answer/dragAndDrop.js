"use strict";
document.addEventListener("DOMContentLoaded", () => {
  // Registers event handlers
  function init() {
    registerEventHandlers();
  }

  // Adds drag event handlers
  function registerEventHandlers() {
    var allDivs = Array.from(document.getElementById("tileContainer").children);
    allDivs.forEach(div => div.addEventListener("dragstart", (event) => onDragStart(event)));
    allDivs.forEach(div => div.addEventListener("drop", (event) => onDrop(event)));
    allDivs.forEach(div => div.addEventListener("dragover", (event) => onDragOver(event)));
  }

  // Capture ID of dragged tile
  function onDragStart(event) {
    event.dataTransfer.setData("sourceID", event.target.id);
  }

  // Swap the position of source and target tile
  function onDrop(event) {
    event.preventDefault();
    var sourceTile = document.getElementById(event.dataTransfer.getData("sourceID"));
    var targetTile = document.getElementById(event.target.id);
    if (sourceTile !== targetTile) {
      swapTiles(sourceTile, targetTile);
      swapPositionClasses(sourceTile, targetTile);
    }

    // Re-orders nodes inside parent container
    function swapTiles(sourceTile, targetTile) {
      var allTiles = document.getElementById("tileContainer");
      var nextTile = targetTile.nextElementSibling;
      if (nextTile === sourceTile)
        allTiles.insertBefore(sourceTile, targetTile);
      else
        allTiles.insertBefore(targetTile, sourceTile);

      if (nextTile)
        allTiles.insertBefore(sourceTile, nextTile);
      else
        allTiles.appendChild(sourceTile);
    }
  }

  // Switch CSS class (position) of elements
  function swapPositionClasses(sourceTile, targetTile) {
    var sourceTilePosition = sourceTile.classList[0];
    var targetTilePosition = targetTile.classList[0];
    if (sourceTilePosition != targetTilePosition) {
      sourceTile.classList.replace(sourceTilePosition, targetTilePosition);
      targetTile.classList.replace(targetTilePosition, sourceTilePosition);
    }
  }

  // Cancel the default action for 'dragover' in order for 'drop' event to fire
  function onDragOver(event) {
    event.preventDefault();
  }

  init();
});


