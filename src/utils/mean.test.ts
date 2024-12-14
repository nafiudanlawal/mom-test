import assert from "node:assert";
import { describe, it } from "node:test";
import { mean } from "./mean";

describe("mean", () => {
  it("should return the mean of 4, 10", () => {
    assert.equal(mean([4, 10]), 7);
  });

  it("should return undefined on empty array", () => {
    assert.equal(mean([]), undefined);
  });
});
