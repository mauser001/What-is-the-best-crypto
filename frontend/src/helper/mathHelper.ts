import { BigNumber } from "ethers";
import { Account } from "../models/Account";

export function numberToHex(num: string | number): string {
    num = typeof num === 'string' ? parseInt(num) : num;
    return `0x${num.toString(16)}`
}

export function normalizeNumbers(bigNumbers: BigNumber[]): number[] {
    return bigNumbers.map(big => big.toNumber());
}

export function sortAccountsByBurn(a: Account, b: Account): number {
    if (a.burnedTokens === b.burnedTokens) {
        return 0;
    }
    else if (BigNumber.from(a.burnedTokens).gt(BigNumber.from(b.burnedTokens))) {
        return -1;
    }
    return 1;
}

export function notEmptyOrNull(value?: string): boolean {
    return value !== undefined && value !== '' && value !== '0';
}

export const sortAccountsBy = (prop: 'donations' | 'burnedTokens') => (a: Account, b: Account): number => {
    if (a[prop] === b[prop]) {
        return 0;
    }
    else if (BigNumber.from(a[prop]).gt(BigNumber.from(b[prop]))) {
        return -1;
    }
    return 1;
}