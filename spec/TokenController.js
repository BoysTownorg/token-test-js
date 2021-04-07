import {
  TokenController,
  SizedTokenController,
} from "../lib/TokenController.js";
import { Action, Color, Shape, Size, hashToken } from "../lib/TokenModel.js";

class TokenControlStub {
  constructor() {
    this.positionFromToken = new Map();
  }

  releaseRedSquare() {
    this.tokenReleasedColor_ = "red";
    this.tokenReleasedIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenReleased();
  }

  releaseGreenSquare() {
    this.tokenReleasedColor_ = "green";
    this.tokenReleasedIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenReleased();
  }

  dragRedCircle() {
    this.tokenDraggedColor_ = "red";
    this.tokenDraggedIsCircle_ = true;
    this.observer.notifyThatTokenHasBeenDragged();
  }

  dragGreenSquare() {
    this.tokenDraggedColor_ = "green";
    this.tokenDraggedIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenDragged();
  }

  dropOntoGreenSquare() {
    this.tokenDroppedOntoColor_ = "green";
    this.tokenDroppedOntoIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenDroppedOnto();
  }

  dropOntoHoldingArea() {
    this.observer.notifyThatHoldingAreaHasBeenDroppedOnto();
    this.observer.notifyThatTokenHasBeenReleased();
  }

  tokenReleasedColor() {
    return this.tokenReleasedColor_;
  }

  tokenReleasedIsCircle() {
    return this.tokenReleasedIsCircle_;
  }

  tokenDraggedColor() {
    return this.tokenDraggedColor_;
  }

  tokenDraggedIsCircle() {
    return this.tokenDraggedIsCircle_;
  }

  tokenDroppedOntoColor() {
    return this.tokenDroppedOntoColor_;
  }

  tokenDroppedOntoIsCircle() {
    return this.tokenDroppedOntoIsCircle_;
  }

  attach(observer) {
    this.observer = observer;
  }

  setTokenPosition(token, position) {
    this.positionFromToken.set(hashToken(token), position);
  }

  tokenPosition(token) {
    return this.positionFromToken.has(hashToken(token))
      ? this.positionFromToken.get(hashToken(token))
      : {
          leftScreenEdgeToLeftEdgePixels: 0,
          topScreenEdgeToTopEdgePixels: 0,
          widthPixels: 0,
          heightPixels: 0,
        };
  }
}

class SizedTokenControlStub {
  releaseSmallRedSquare() {
    this.tokenReleasedColor_ = "red";
    this.tokenReleasedIsCircle_ = false;
    this.tokenReleasedIsSmall_ = true;
    this.observer.notifyThatTokenHasBeenReleased();
  }

  dragSmallRedCircle() {
    this.tokenDraggedColor_ = "red";
    this.tokenDraggedIsCircle_ = true;
    this.tokenDraggedIsSmall_ = true;
    this.observer.notifyThatTokenHasBeenDragged();
  }

  dropOntoLargeGreenSquare() {
    this.tokenDroppedOntoColor_ = "green";
    this.tokenDroppedOntoIsCircle_ = false;
    this.tokenDroppedOntoIsSmall_ = false;
    this.observer.notifyThatTokenHasBeenDroppedOnto();
  }

  dropOntoHoldingArea() {
    this.observer.notifyThatHoldingAreaHasBeenDroppedOnto();
    this.observer.notifyThatTokenHasBeenReleased();
  }

  tokenDraggedColor() {
    return this.tokenDraggedColor_;
  }

  tokenDraggedIsCircle() {
    return this.tokenDraggedIsCircle_;
  }

  tokenDroppedOntoColor() {
    return this.tokenDroppedOntoColor_;
  }

  tokenDroppedOntoIsCircle() {
    return this.tokenDroppedOntoIsCircle_;
  }

  tokenDraggedIsSmall() {
    return this.tokenDraggedIsSmall_;
  }

  tokenDroppedOntoIsSmall() {
    return this.tokenDroppedOntoIsSmall_;
  }

  tokenReleasedColor() {
    return this.tokenReleasedColor_;
  }

  tokenReleasedIsCircle() {
    return this.tokenReleasedIsCircle_;
  }

  tokenReleasedIsSmall() {
    return this.tokenReleasedIsSmall_;
  }

  attach(observer) {
    this.observer = observer;
  }
}

class TokenModelStub {
  singleTokenInteraction() {
    return this.singleTokenInteraction_;
  }

  dualTokenInteraction() {
    return this.dualTokenInteraction_;
  }

  submitSingleTokenInteraction(singleTokenInteraction_, tokenRelation_) {
    this.singleTokenInteraction_ = singleTokenInteraction_;
    this.tokenRelation_ = tokenRelation_;
  }

  submitDualTokenInteraction(dualTokenInteraction_) {
    this.dualTokenInteraction_ = dualTokenInteraction_;
  }

  tokenRelation() {
    return this.tokenRelation_;
  }
}

function yDifference(pointA, pointB) {
  return pointA.y - pointB.y;
}

function xDifference(pointA, pointB) {
  return pointA.x - pointB.x;
}

function distance(pointA, pointB) {
  return Math.sqrt(
    xDifference(pointA, pointB) * xDifference(pointA, pointB) +
      yDifference(pointA, pointB) * yDifference(pointA, pointB)
  );
}

function setTokenPosition(control, token, position) {
  control.setTokenPosition(token, position);
}

describe("TokenController", () => {
  beforeEach(function () {
    this.control = new TokenControlStub();
    this.model = new TokenModelStub();
    const controller = new TokenController(this.control, this.model);
  });

  it("should submit touch action when user releases red square", function () {
    this.control.releaseRedSquare();
    expect(this.model.singleTokenInteraction().action).toBe(Action.touch);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.square);
  });

  it("should submit use-to-touch action when user drags red circle onto green square", function () {
    this.control.dragRedCircle();
    this.control.dropOntoGreenSquare();
    expect(this.model.dualTokenInteraction().action).toBe(Action.useToTouch);
    expect(this.model.dualTokenInteraction().firstToken.color).toBe(Color.red);
    expect(this.model.dualTokenInteraction().firstToken.shape).toBe(
      Shape.circle
    );
    expect(this.model.dualTokenInteraction().secondToken.color).toBe(
      Color.green
    );
    expect(this.model.dualTokenInteraction().secondToken.shape).toBe(
      Shape.square
    );
  });

  it("should submit pick-up action when user drags red circle onto holding area", function () {
    this.control.dragRedCircle();
    this.control.dropOntoHoldingArea();
    expect(this.model.singleTokenInteraction().action).toBe(Action.pickUp);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.circle);
  });

  it("should determine whether green square is further from yellow square after drag", function () {
    setTokenPosition(
      this.control,
      { color: Color.yellow, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 10,
        topScreenEdgeToTopEdgePixels: 20,
        widthPixels: 30,
        heightPixels: 40,
      }
    );
    setTokenPosition(
      this.control,
      { color: Color.green, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 50,
        topScreenEdgeToTopEdgePixels: 60,
        widthPixels: 70,
        heightPixels: 80,
      }
    );
    this.control.dragGreenSquare();
    setTokenPosition(
      this.control,
      { color: Color.green, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 90,
        topScreenEdgeToTopEdgePixels: 100,
        widthPixels: 70,
        heightPixels: 80,
      }
    );
    this.control.releaseGreenSquare();
    expect(
      this.model.tokenRelation().releasedTokenIsFurtherFrom({
        color: Color.yellow,
        shape: Shape.square,
      })
    ).toBe(
      distance(
        {
          x: 10 + 30 / 2,
          y: 20 + 40 / 2,
        },
        {
          x: 90 + 70 / 2,
          y: 100 + 80 / 2,
        }
      ) >
        distance(
          {
            x: 10 + 30 / 2,
            y: 20 + 40 / 2,
          },
          {
            x: 50 + 70 / 2,
            y: 60 + 80 / 2,
          }
        )
    );
  });
});

describe("SizedTokenController", () => {
  beforeEach(function () {
    this.control = new SizedTokenControlStub();
    this.model = new TokenModelStub();
    new SizedTokenController(this.control, this.model);
  });

  it("should submit touch action when user releases small red square", function () {
    this.control.releaseSmallRedSquare();
    expect(this.model.singleTokenInteraction().action).toBe(Action.touch);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.square);
    expect(this.model.singleTokenInteraction().token.size).toBe(Size.small);
  });

  it("should submit use-to-touch action when user drags small red circle onto large green square", function () {
    this.control.dragSmallRedCircle();
    this.control.dropOntoLargeGreenSquare();
    expect(this.model.dualTokenInteraction().action).toBe(Action.useToTouch);
    expect(this.model.dualTokenInteraction().firstToken.color).toBe(Color.red);
    expect(this.model.dualTokenInteraction().firstToken.shape).toBe(
      Shape.circle
    );
    expect(this.model.dualTokenInteraction().firstToken.size).toBe(Size.small);
    expect(this.model.dualTokenInteraction().secondToken.color).toBe(
      Color.green
    );
    expect(this.model.dualTokenInteraction().secondToken.shape).toBe(
      Shape.square
    );
    expect(this.model.dualTokenInteraction().secondToken.size).toBe(Size.large);
  });

  it("should submit pick-up action when user drags small red circle onto holding area", function () {
    this.control.dragSmallRedCircle();
    this.control.dropOntoHoldingArea();
    expect(this.model.singleTokenInteraction().action).toBe(Action.pickUp);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.circle);
    expect(this.model.singleTokenInteraction().token.size).toBe(Size.small);
  });
});
