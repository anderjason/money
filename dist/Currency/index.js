"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
class Currency {
    constructor(definition) {
        this.isoCode = definition.isoCode;
        this.decimalDigits = definition.decimalDigits;
        this.currencyName = definition.currencyName;
        this.namePlural = definition.namePlural;
        this.symbol = definition.symbol;
    }
    static ofUSD() {
        return currencyByISOCode.get("USD");
    }
    static givenISOCode(isoCode) {
        return currencyByISOCode.get(isoCode);
    }
    static toISOCodes() {
        return Array.from(currencyByISOCode.keys());
    }
    static isEqual(a, b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        return a.isEqual(b);
    }
    isEqual(other) {
        if (other == null) {
            return false;
        }
        if (!(other instanceof Currency)) {
            return false;
        }
        return other.isoCode === this.isoCode;
    }
}
exports.Currency = Currency;
const currencyByISOCode = new Map();
currencyByISOCode.set("USD", new Currency({
    isoCode: "USD",
    currencyName: "US Dollar",
    namePlural: "US dollars",
    symbol: "$",
    decimalDigits: 2,
}));
//# sourceMappingURL=index.js.map