import { Currency } from "../Currency";
export declare type MoneyStringFormat = "1" | "1.00" | "$1" | "$1.00" | "1 USD" | "1.00 USD";
export declare class Money {
    readonly rawValue: number;
    readonly currency: Currency;
    static isEqual(a: Money, b: Money): boolean;
    constructor(internalValue: number, currency: Currency);
    get isZero(): boolean;
    get isNegative(): boolean;
    get isPositive(): boolean;
    isEqual(other: Money): boolean;
    withAddedMoney(other: Money): Money;
    withSubtractedMoney(other: Money): Money;
    withMultipliedScalar(scalar: number, roundResult: (rawValue: number) => number): Money;
    withDividedScalar(scalar: number, roundResult: (rawValue: number) => number): Money;
    toWeightedSplit(ratios: number[]): Money[];
    toEqualSplit(count: number): Money[];
    toString(moneyFormat: MoneyStringFormat): string;
}
