export interface CurrencyDefinition {
    isoCode: string;
    currencyName: string;
    namePlural: string;
    symbol: string;
    decimalDigits: number;
}
export declare class Currency {
    readonly isoCode: string;
    readonly currencyName: string;
    readonly namePlural: string;
    readonly symbol: string;
    readonly decimalDigits: number;
    static ofUSD(): Currency;
    static givenISOCode(isoCode: string): Currency;
    static toISOCodes(): string[];
    static isEqual(a: Currency, b: Currency): boolean;
    constructor(definition: CurrencyDefinition);
    isEqual(other: Currency): boolean;
}
