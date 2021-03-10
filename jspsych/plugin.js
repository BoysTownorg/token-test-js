import { TokenModel } from "../lib/TokenModel.js";
import {
  SizedTokenController,
  TokenController,
} from "../lib/TokenController.js";
import { parseTokenInteractions } from "../lib/TokenTrialConfigurationParser.js";

function addEventListener(element, event, f) {
  element.addEventListener(event, f);
}

function addClickEventListener(element, f) {
  addEventListener(element, "click", f);
}

function addDragEventListener(element, f) {
  addEventListener(element, "dragstart", f);
}

function divElement() {
  return document.createElement("div");
}

function pixelsString(a) {
  return `${a}px`;
}

const tokenWidthPixels = 150;
const smallTokenWidthPixels = 100;
const tokenBorderWidthPixels = 2;
function tokenBorder(borderWidthPixels) {
  return `${pixelsString(borderWidthPixels)} solid black`;
}

function circleElementWithColor(color) {
  const circle = divElement();
  const diameterPixels = tokenWidthPixels;
  circle.style.height = pixelsString(diameterPixels);
  circle.style.width = pixelsString(diameterPixels);
  const borderWidthPixels = tokenBorderWidthPixels;
  circle.style.borderRadius = pixelsString(
    diameterPixels / 2 + borderWidthPixels
  );
  circle.style.border = tokenBorder(borderWidthPixels);
  circle.style.margin = "auto";
  circle.style.backgroundColor = color;
  return circle;
}

function smallCircleElementWithColor(color) {
  const circle = divElement();
  const diameterPixels = smallTokenWidthPixels;
  circle.style.height = pixelsString(diameterPixels);
  circle.style.width = pixelsString(diameterPixels);
  const borderWidthPixels = tokenBorderWidthPixels;
  circle.style.borderRadius = pixelsString(
    diameterPixels / 2 + borderWidthPixels
  );
  circle.style.border = tokenBorder(borderWidthPixels);
  circle.style.margin = "auto";
  circle.style.backgroundColor = color;
  return circle;
}

function squareElementWithColor(color) {
  const square = divElement();
  const widthPixels = tokenWidthPixels;
  square.style.height = pixelsString(widthPixels);
  square.style.width = pixelsString(widthPixels);
  square.style.border = tokenBorder(tokenBorderWidthPixels);
  square.style.margin = "auto";
  square.style.backgroundColor = color;
  return square;
}

function smallSquareElementWithColor(color) {
  const square = divElement();
  const widthPixels = smallTokenWidthPixels;
  square.style.height = pixelsString(widthPixels);
  square.style.width = pixelsString(widthPixels);
  square.style.border = tokenBorder(tokenBorderWidthPixels);
  square.style.margin = "auto";
  square.style.backgroundColor = color;
  return square;
}

function adopt(parent, child) {
  parent.append(child);
}

function clear(parent) {
  // https://stackoverflow.com/a/3955238
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}

class TokenControl {
  constructor(parent, instructionMessage) {
    this.parent = parent;
    const instructions = divElement();
    instructions.textContent = instructionMessage;
    adopt(parent, instructions);
    const grid = divElement();
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(5, 1fr)";
    grid.style.gridTemplateRows = "repeat(2, 1fr)";
    grid.style.gridGap = `${pixelsString(60)} ${pixelsString(60)}`;
    adopt(parent, grid);
    this.addTokenRow(
      grid,
      1,
      ["red", "black", "yellow", "white", "green"],
      circleElementWithColor
    );
    this.addTokenRow(
      grid,
      2,
      ["black", "red", "white", "green", "yellow"],
      squareElementWithColor
    );
  }

  addTokenRow(grid, row, colors, create) {
    for (let i = 0; i < colors.length; i += 1) {
      const token = create(colors[i]);
      token.draggable = true;
      token.style.gridRow = row;
      token.style.gridColumn = i + 1;
      adopt(grid, token);
      addClickEventListener(token, (e) => {
        this.tokenClicked = token;
        this.observer.notifyThatTokenHasBeenClicked();
      });
      addDragEventListener(token, (e) => {
        e.dataTransfer.effectAllowed = "move";
        this.tokenDragged = token;
        this.observer.notifyThatTokenHasBeenDragged();
      });
      addEventListener(token, "dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      addEventListener(token, "drop", (e) => {
        e.preventDefault();
        this.tokenDroppedOnto = token;
        this.observer.notifyThatTokenHasBeenDroppedOnto();
      });
    }
  }

  tokenClickedColor() {
    return this.tokenClicked.style.backgroundColor;
  }

  tokenClickedIsCircle() {
    return this.tokenClicked.style.borderRadius !== "";
  }

  tokenDraggedColor() {
    return this.tokenDragged.style.backgroundColor;
  }

  tokenDraggedIsCircle() {
    return this.tokenDragged.style.borderRadius !== "";
  }

  tokenDroppedOntoColor() {
    return this.tokenDroppedOnto.style.backgroundColor;
  }

  tokenDroppedOntoIsCircle() {
    return this.tokenDroppedOnto.style.borderRadius !== "";
  }

  attach(observer) {
    this.observer = observer;
  }
}

class SizedTokenControl {
  constructor(parent, instructionMessage) {
    this.parent = parent;
    const instructions = divElement();
    instructions.textContent = instructionMessage;
    adopt(parent, instructions);
    const grid = divElement();
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(5, 1fr)";
    grid.style.gridTemplateRows = "repeat(4, 1fr)";
    grid.style.gridGap = `${pixelsString(60)} ${pixelsString(60)}`;
    adopt(parent, grid);
    this.addTokenRow(
      grid,
      1,
      ["red", "black", "yellow", "white", "green"],
      circleElementWithColor
    );
    this.addTokenRow(
      grid,
      2,
      ["black", "red", "white", "green", "yellow"],
      squareElementWithColor
    );
    this.addTokenRow(
      grid,
      3,
      ["red", "black", "yellow", "white", "green"],
      smallCircleElementWithColor
    );
    this.addTokenRow(
      grid,
      4,
      ["black", "red", "white", "green", "yellow"],
      smallSquareElementWithColor
    );
  }

  addTokenRow(grid, row, colors, create) {
    for (let i = 0; i < colors.length; i += 1) {
      const token = create(colors[i]);
      token.draggable = true;
      token.style.gridRow = row;
      token.style.gridColumn = i + 1;
      adopt(grid, token);
      addClickEventListener(token, (e) => {
        this.tokenClicked = token;
        this.observer.notifyThatTokenHasBeenClicked();
      });
      addDragEventListener(token, (e) => {
        e.dataTransfer.effectAllowed = "move";
        this.tokenDragged = token;
        this.observer.notifyThatTokenHasBeenDragged();
      });
      addEventListener(token, "dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      addEventListener(token, "drop", (e) => {
        e.preventDefault();
        this.tokenDroppedOnto = token;
        this.observer.notifyThatTokenHasBeenDroppedOnto();
      });
    }
  }

  tokenClickedColor() {
    return this.tokenClicked.style.backgroundColor;
  }

  tokenClickedIsCircle() {
    return this.tokenClicked.style.borderRadius !== "";
  }

  tokenClickedIsSmall() {
    return (
      this.tokenClicked.style.width === pixelsString(smallTokenWidthPixels)
    );
  }

  tokenDraggedColor() {
    return this.tokenDragged.style.backgroundColor;
  }

  tokenDraggedIsCircle() {
    return this.tokenDragged.style.borderRadius !== "";
  }

  tokenDraggedIsSmall() {
    return (
      this.tokenDragged.style.width === pixelsString(smallTokenWidthPixels)
    );
  }

  tokenDroppedOntoColor() {
    return this.tokenDroppedOnto.style.backgroundColor;
  }

  tokenDroppedOntoIsCircle() {
    return this.tokenDroppedOnto.style.borderRadius !== "";
  }

  tokenDroppedOntoIsSmall() {
    return (
      this.tokenDroppedOnto.style.width === pixelsString(smallTokenWidthPixels)
    );
  }

  attach(observer) {
    this.observer = observer;
  }
}

class JsPsychTrial {
  conclude(result) {
    jsPsych.finishTrial(result);
  }
}

export function plugin() {
  return {
    trial(display_element, trial) {
      clear(display_element);
      new TokenController(
        new TokenControl(display_element, trial.sentence),
        new TokenModel(
          new JsPsychTrial(),
          parseTokenInteractions(trial.commandString)
        )
      );
    },
    info: {
      parameters: {},
    },
  };
}

export function twoSizesPlugin() {
  return {
    trial(display_element, trial) {
      clear(display_element);
      new SizedTokenController(
        new SizedTokenControl(display_element, trial.sentence),
        new TokenModel(
          new JsPsychTrial(),
          parseTokenInteractions(trial.commandString)
        )
      );
    },
    info: {
      parameters: {},
    },
  };
}
