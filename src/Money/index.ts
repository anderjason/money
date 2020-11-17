import { Currency } from "../Currency";
import { NumberUtil } from "@anderjason/util";

export type MoneyStringFormat =
  | "1"
  | "1.00"
  | "$1"
  | "$1.00"
  | "1 USD"
  | "1.00 USD";

export class Money {
  readonly rawValue: number;
  readonly currency: Currency;

  static isEqual(a: Money, b: Money): boolean {
    if (a == null && b == null) {
      return true;
    }

    if (a == null || b == null) {
      return false;
    }

    return a.isEqual(b);
  }

  constructor(internalValue: number, currency: Currency) {
    if (!NumberUtil.numberLikeIsIntegerLike(internalValue)) {
      throw new TypeError("Amount must be an integer");
    }

    this.rawValue = internalValue;
    this.currency = currency;
  }

  get isZero(): boolean {
    return this.rawValue === 0;
  }

  get isNegative(): boolean {
    return this.rawValue < 0;
  }

  get isPositive(): boolean {
    return this.rawValue > 0;
  }

  isEqual(other: Money): boolean {
    if (other == null) {
      return false;
    }

    if (!(other instanceof Money)) {
      return false;
    }

    return other.rawValue === this.rawValue && other.currency === this.currency;
  }

  withAddedMoney(other: Money): Money {
    if (other == null) {
      throw new Error("Other is required");
    }

    if (!(other instanceof Money)) {
      throw new Error("Other must be an instance of Money");
    }

    return new Money(this.rawValue + other.rawValue, this.currency);
  }

  withSubtractedMoney(other: Money): Money {
    if (other == null) {
      throw new Error("Other is required");
    }

    if (!(other instanceof Money)) {
      throw new Error("Other must be an instance of Money");
    }

    return new Money(this.rawValue - other.rawValue, this.currency);
  }

  withMultipliedScalar(
    scalar: number,
    roundResult: (rawValue: number) => number
  ): Money {
    const amount = roundResult(this.rawValue * scalar);

    return new Money(amount, this.currency);
  }

  withDividedScalar(
    scalar: number,
    roundResult: (rawValue: number) => number
  ): Money {
    const amount = roundResult(this.rawValue / scalar);

    return new Money(amount, this.currency);
  }

  toWeightedSplit(ratios: number[]): Money[] {
    if (ratios == null || ratios.length === 0) {
      throw new Error("At least one ratio is required to allocate");
    }

    let remainder = this.rawValue;
    let results: Money[] = [];
    let totalRatio: number = 0;

    ratios.forEach((ratio: number) => {
      totalRatio += ratio;
    });

    let share: number;
    ratios.forEach((ratio) => {
      share = Math.floor((this.rawValue * ratio) / totalRatio);

      results.push(new Money(share, this.currency));

      remainder -= share;
    });

    for (let i = 0; remainder > 0; i++) {
      results[i] = new Money(results[i].rawValue + 1, results[i].currency);
      remainder--;
    }

    return results;
  }

  toEqualSplit(count: number): Money[] {
    if (count < 1) {
      throw new Error("Must split into at least one part");
    }

    return this.toWeightedSplit(Array(count).fill(1));
  }

  toString(moneyFormat: MoneyStringFormat): string {
    const convertedValue: number =
      this.rawValue / Math.pow(10, this.currency.decimalDigits);
    const valueHasDecimalPoint = convertedValue % 1 !== 0;

    let numberString: string;

    let formatHasDecimalPoint: boolean;

    switch (moneyFormat) {
      case "1.00":
      case "$1.00":
      case "1.00 USD":
        formatHasDecimalPoint = true;
        break;
      case "1":
      case "$1":
      case "1 USD":
        formatHasDecimalPoint = false;
        break;
      default:
        throw new Error("Unsupported money format");
    }

    if (formatHasDecimalPoint || valueHasDecimalPoint) {
      numberString = convertedValue.toFixed(this.currency.decimalDigits);
    } else {
      // format doesn't require a decimal point, and the value doesn't have one,
      // so just use the number as-is
      numberString = String(convertedValue);
    }

    switch (moneyFormat) {
      case "1":
      case "1.00":
        return numberString;
      case "$1":
      case "$1.00":
        return `${this.currency.symbol}${numberString}`;
      case "1 USD":
      case "1.00 USD":
        return `${numberString} ${this.currency.isoCode}`;
      default:
        throw new Error(`Unsupported money format '${moneyFormat}'`);
    }
  }
}
