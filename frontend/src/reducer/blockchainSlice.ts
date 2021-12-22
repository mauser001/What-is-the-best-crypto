import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BigNumber } from 'ethers'
import { getWeb3Account, getContract, getSigner, ethToWei, getUserBalance, getTheBest } from '../helper/web3Helper'
import { Account } from '../models/Account'
import { AppDispatch } from '../store/store'

export enum STATE {
    init,
    noProvider,
    connecting,
    notConnected,
    wrongNetwork,
    connected
}

export interface BlockchainState {
    networkState: STATE,
    userAddress?: string,
    accounts?: Account[],
    totalDonationAmount?: string,
    totalBurnedAmount?: string,
    highestBurnedAmount?: string,
    highestDonationAmount?: string,
    tokenBalance?: string,
    theBestCrypto?: string,
}

const initialState: BlockchainState = {
    networkState: STATE.init,
    accounts: [],
}

export const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<STATE>) => {
            state.networkState = action.payload
        },
        setUserAddress: (state, action: PayloadAction<string>) => {
            state.userAddress = action.payload
        },
        setAccounts: (state, action: PayloadAction<Account[]>) => {
            state.accounts = action.payload
        },
        setTotalDonationAmount: (state, action: PayloadAction<string>) => {
            state.totalDonationAmount = action.payload
        },
        setTotalBurnedAmount: (state, action: PayloadAction<string>) => {
            state.totalBurnedAmount = action.payload
        },
        setHighestBurnedAmount: (state, action: PayloadAction<string>) => {
            state.highestBurnedAmount = action.payload
        },
        setHighestDonationAmount: (state, action: PayloadAction<string>) => {
            state.highestDonationAmount = action.payload
        },
        setTokenBalance: (state, action: PayloadAction<string>) => {
            state.tokenBalance = action.payload
        },
        setTheBestCrypto: (state, action: PayloadAction<string>) => {
            state.theBestCrypto = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
const {
    setState,
    setAccounts,
    setTheBestCrypto,
    setTokenBalance,
    setTotalDonationAmount,
    setTotalBurnedAmount,
    setHighestBurnedAmount,
    setHighestDonationAmount,
    setUserAddress
} = blockchainSlice.actions
export { setState };

// Get account infos
export const getAccounts = () => async (dispatch: AppDispatch): Promise<boolean> => {
    try {
        const contract = await getContract();
        if (contract) {
            const doners: string[] = await contract.doners();
            const donations: BigNumber[] = await contract.donations(doners);
            const burnedTokens: BigNumber[] = await contract.burnedTokens(doners);
            var totalDonationAmount: BigNumber = BigNumber.from(0);
            var totalBurnedAmount: BigNumber = BigNumber.from(0);
            let maxBurnedAmount: BigNumber = BigNumber.from(0);
            let maxDonationAmount: BigNumber = BigNumber.from(0);

            const accounts: Account[] = doners.map((value, index) => {
                totalDonationAmount = totalDonationAmount.add(donations[index]);
                totalBurnedAmount = totalBurnedAmount.add(burnedTokens[index]);
                if (burnedTokens[index].gt(maxBurnedAmount)) {
                    maxBurnedAmount = burnedTokens[index];
                }
                if (donations[index].gt(maxDonationAmount)) {
                    maxDonationAmount = donations[index];
                }
                return {
                    address: value,
                    burnedTokens: burnedTokens[index].toString(),
                    donations: donations[index].toString(),
                }
            });
            dispatch(setAccounts(accounts));
            dispatch(setTotalBurnedAmount(totalBurnedAmount.toString()));
            dispatch(setTotalDonationAmount(totalDonationAmount.toString()));
            dispatch(setHighestBurnedAmount(maxBurnedAmount.toString()));
            dispatch(setHighestDonationAmount(maxDonationAmount.toString()));
        }
    }
    catch (e) {
        console.log(`error getting accounts: ${e}`);
    }
    return false;
}

export const getUserAccount = () => async (dispatch: AppDispatch): Promise<boolean> => {
    try {
        const account = await getWeb3Account();
        if (account) {
            dispatch(setUserAddress(account));
        }
    }
    catch (e) {
        console.log(`error getting accounts: ${e}`);
    }
    return false;
}

export const getTokenBalance = (address: string) => async (dispatch: AppDispatch): Promise<boolean> => {
    try {
        const balance = await getUserBalance(address);
        if (balance) {
            dispatch(setTokenBalance(balance.toString()));
        }
    }
    catch (e) {
        console.log(`error getting the token balance: ${e}`);
    }
    return false;
}

export const getTheBestCrypto = () => async (dispatch: AppDispatch): Promise<boolean> => {
    try {
        const theBest = await getTheBest();
        if (theBest) {
            dispatch(setTheBestCrypto(theBest));
        }
    }
    catch (e) {
        console.log(`error getting the best: ${e}`);
    }
    return false;
}


export const sendDonation = (value: number, address: string) => async (dispatch: AppDispatch): Promise<true | string> => {
    try {
        const contract = await getContract();
        let overrides: any = {
            value: ethToWei(value),
            from: address
        };

        if (contract) {
            let gas: BigNumber = await contract.estimateGas.donate(overrides);
            overrides.gasLimit = gas;
            let transaction = await contract.populateTransaction.donate(overrides);
            await getSigner().sendTransaction(transaction);
            return true;
        }
        else {
            return 'could not load contract';
        }

    }
    catch (e: any) {
        console.log(`error sending donation ${e}`);
        return e.hasOwnProperty('message') ? e.message : JSON.stringify(e);
    }
}

export const burnTokens = (value: string, best: string, address: string) => async (dispatch: AppDispatch): Promise<true | string> => {
    try {
        const contract = await getContract();
        if (contract) {
            let overrides: any = {
                from: address
            };
            const bigValue = BigNumber.from(value);
            let gas: BigNumber = await contract.estimateGas.burn(bigValue, best, overrides);
            overrides.gasLimit = gas;
            let transaction = await contract.populateTransaction.burn(bigValue, best, overrides);
            await getSigner().sendTransaction(transaction);
            return true;
        }
        else {
            return 'could not load contract';
        }

    }
    catch (e: any) {
        console.log(`error sending donation ${e}`);
        return e.hasOwnProperty('message') ? e.message : JSON.stringify(e);
    }
}

export default blockchainSlice.reducer