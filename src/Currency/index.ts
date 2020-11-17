export interface CurrencyDefinition {
  isoCode: string;
  currencyName: string;
  namePlural: string;
  symbol: string;
  decimalDigits: number;
}

export class Currency {
  readonly isoCode: string; // USD
  readonly currencyName: string; // US Dollar
  readonly namePlural: string; // US dollars
  readonly symbol: string; // $
  readonly decimalDigits: number;

  static ofUSD(): Currency {
    return currencyByISOCode.get("USD");
  }

  static givenISOCode(isoCode: string): Currency {
    return currencyByISOCode.get(isoCode);
  }

  static toISOCodes(): string[] {
    return Array.from(currencyByISOCode.keys());
  }

  static isEqual(a: Currency, b: Currency): boolean {
    if (a == null && b == null) {
      return true;
    }

    if (a == null || b == null) {
      return false;
    }

    return a.isEqual(b);
  }

  constructor(definition: CurrencyDefinition) {
    this.isoCode = definition.isoCode;
    this.decimalDigits = definition.decimalDigits;
    this.currencyName = definition.currencyName;
    this.namePlural = definition.namePlural;
    this.symbol = definition.symbol;
  }

  isEqual(other: Currency): boolean {
    if (other == null) {
      return false;
    }

    if (!(other instanceof Currency)) {
      return false;
    }

    return other.isoCode === this.isoCode;
  }
}

const currencyByISOCode = new Map<string, Currency>();

currencyByISOCode.set(
  "USD",
  new Currency({
    isoCode: "USD",
    currencyName: "US Dollar",
    namePlural: "US dollars",
    symbol: "$",
    decimalDigits: 2,
  })
);
