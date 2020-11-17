import { Test } from "@anderjason/tests";
import { Currency } from "../Currency";
import { Money } from "./";

Test.define("Money can be created", () => {
  const money = new Money(499, Currency.ofUSD());

  Test.assert(money.rawValue === 499);
  Test.assert(money.isPositive == true);
  Test.assert(money.isNegative == false);
  Test.assert(money.isZero == false);
});

Test.define("Money can be zero", () => {
  const money = new Money(0, Currency.ofUSD());

  Test.assert(money.rawValue === 0);
  Test.assert(money.isPositive == false);
  Test.assert(money.isNegative == false);
  Test.assert(money.isZero == true);
});

Test.define("Money can be negative", () => {
  const money = new Money(-199, Currency.ofUSD());

  Test.assert(money.rawValue === -199);
  Test.assert(money.isPositive == false);
  Test.assert(money.isNegative == true);
  Test.assert(money.isZero == false);
});

Test.define("Money rejects fractional input", async () => {
  await Test.assertThrows(() => {
    new Money(1.99, Currency.ofUSD());
  });
});

Test.define("Money rejects invalid input", async () => {
  await Test.assertThrows(() => {
    new Money(null, Currency.ofUSD());
  });

  await Test.assertThrows(() => {
    new Money(undefined, Currency.ofUSD());
  });

  await Test.assertThrows(() => {
    new Money(NaN, Currency.ofUSD());
  });
});

Test.define("Money can be compared to other money", () => {
  const a = new Money(199, Currency.ofUSD());
  const b = new Money(199, Currency.ofUSD());
  const c = new Money(300, Currency.ofUSD());

  Test.assert(a.isEqual(b));
  Test.assert(b.isEqual(a));
  Test.assert(!a.isEqual(c));
  Test.assert(Money.isEqual(a, b));
  Test.assert(!Money.isEqual(b, c));
});

Test.define("Money can convert to a string", () => {
  const money = new Money(499, Currency.ofUSD());

  Test.assert(money.toString("$1.00") === "$4.99");
  Test.assert(money.toString("1.00 USD") === "4.99 USD");
  Test.assert(money.toString("1.00") === "4.99");
  Test.assert(money.toString("1") === "4.99");
});

Test.define(
  "Money can format without a decimal place if the value allows it",
  () => {
    const money = new Money(3000, Currency.ofUSD());

    Test.assert(money.rawValue === 3000);
    Test.assert(money.toString("$1") === "$30");
    Test.assert(money.toString("1") === "30");
  }
);

Test.define("Money can add another value", () => {
  const a = new Money(3000, Currency.ofUSD());
  const b = new Money(1499, Currency.ofUSD());

  const money = a.withAddedMoney(b);
  Test.assert(money.rawValue === 4499);
  Test.assert(money.toString("$1") === "$44.99");
});

Test.define("Money can subtract another value", () => {
  const a = new Money(3000, Currency.ofUSD());
  const b = new Money(1499, Currency.ofUSD());

  const money = a.withSubtractedMoney(b);
  Test.assert(money.rawValue === 1501);
  Test.assert(money.toString("$1.00") === "$15.01");
});

Test.define("Money can multiply by an amount", () => {
  const a = new Money(125, Currency.ofUSD());

  const money = a.withMultipliedScalar(2.5, Math.floor);
  Test.assert(money.rawValue === 312); // 312.5 rounded down

  const money2 = a.withMultipliedScalar(2.5, Math.ceil);
  Test.assert(money2.rawValue === 313); // 312.5 rounded up
});

Test.define("Money can multiply by an amount", () => {
  const a = new Money(125, Currency.ofUSD());

  const money = a.withMultipliedScalar(2.5, Math.floor);
  Test.assert(money.rawValue === 312); // 312.5 rounded down

  const money2 = a.withMultipliedScalar(2.5, Math.ceil);
  Test.assert(money2.rawValue === 313); // 312.5 rounded up
});

Test.define("Money can divide by an amount", () => {
  const a = new Money(125, Currency.ofUSD());

  const money = a.withDividedScalar(2, Math.floor);
  Test.assert(money.rawValue === 62); // 62.5 rounded down

  const money2 = a.withDividedScalar(2, Math.ceil);
  Test.assert(money2.rawValue === 63); // 62.5 rounded up
});

Test.define("Money can split based on an array of ratios", async () => {
  const original = new Money(1000, Currency.ofUSD());

  const fourWays = original.toWeightedSplit([1, 1, 1, 1]);
  Test.assertIsEqual(fourWays.length, 4);
  Test.assertIsEqual(fourWays[0].rawValue, 250);
  Test.assertIsEqual(fourWays[1].rawValue, 250);
  Test.assertIsEqual(fourWays[2].rawValue, 250);
  Test.assertIsEqual(fourWays[3].rawValue, 250);

  const threeWays = original.toWeightedSplit([1, 1, 1]);
  Test.assertIsEqual(threeWays.length, 3);
  Test.assertIsEqual(threeWays[0].rawValue, 334);
  Test.assertIsEqual(threeWays[1].rawValue, 333);
  Test.assertIsEqual(threeWays[2].rawValue, 333);
});

Test.define("Money can split into a number of equal parts", async () => {
  const original = new Money(1000, Currency.ofUSD());

  const fourWays = original.toEqualSplit(4);
  Test.assertIsEqual(fourWays.length, 4);
  Test.assertIsEqual(fourWays[0].rawValue, 250);
  Test.assertIsEqual(fourWays[1].rawValue, 250);
  Test.assertIsEqual(fourWays[2].rawValue, 250);
  Test.assertIsEqual(fourWays[3].rawValue, 250);

  const threeWays = original.toEqualSplit(3);
  Test.assertIsEqual(threeWays.length, 3);
  Test.assertIsEqual(threeWays[0].rawValue, 334);
  Test.assertIsEqual(threeWays[1].rawValue, 333);
  Test.assertIsEqual(threeWays[2].rawValue, 333);
});

Test.define("Money can split into parts based on ratios", async () => {
  const original = new Money(999, Currency.ofUSD());

  const fourWays = original.toWeightedSplit([1, 2, 4, 8]);
  Test.assertIsEqual(fourWays.length, 4);
  Test.assertIsEqual(fourWays[0].rawValue, 67);
  Test.assertIsEqual(fourWays[1].rawValue, 134);
  Test.assertIsEqual(fourWays[2].rawValue, 266);
  Test.assertIsEqual(fourWays[3].rawValue, 532);
});
