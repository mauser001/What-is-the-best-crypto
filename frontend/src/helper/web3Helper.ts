import { BigNumber, ethers } from "ethers";
import { numberToHex } from "./mathHelper";
import WhatIsTheBest from '../assets/abi/WhatIsTheBest.json';


export async function getWeb3Account(): Promise<string | undefined> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId.toString() === process.env.REACT_APP_CHAIN_ID) {
        const list = await provider.send("eth_requestAccounts", []);
        console.log(`account: ${JSON.stringify(list[0])}`)
        return list[0];
    }
}

export async function getUserBalance(address: string): Promise<BigNumber> {
    const contract = await getContract();
    return await contract?.balanceOf(address);
}

export async function getTheBest(): Promise<string> {
    const contract = await getContract();
    return await contract?.theBest();
}

export function getSigner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
}

export async function getContract(): Promise<ethers.Contract | undefined> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId.toString() === process.env.REACT_APP_CHAIN_ID) {
        const contract = new ethers.Contract(process.env.REACT_APP_SMART_CONTRACT_ADDRESS!, WhatIsTheBest.abi, provider);
        return contract;
    }
}

export async function addContractListeners(func: () => void) {
    const contract = await getContract();
    if (contract) {
        contract.on('Donation', func);
        contract.on('Burn', func);
    }
}

export async function removeAllContractListeners() {
    const contract = await getContract();
    if (contract) {
        contract.removeAllListeners();
    }
}

export async function switchNetwork(id: string | number) {
    try {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: numberToHex(id) }] });
    }
    catch (e: any) {
        if (e.code === 4902) {
            await addNetwork(id);
        }
        else throw (e);
    }
}

export function sameAddress(a?: string, b?: string) {
    return a?.toUpperCase() === b?.toUpperCase();
}

export async function addNetwork(id: string | number) {

    let networkData;
    id = typeof id === 'string' ? parseInt(id) : id;

    switch (id) {

        //Polygon Mainnet

        case 137:

            networkData = [

                {

                    chainId: numberToHex(id),

                    chainName: "Polygon Mainnet",

                    rpcUrls: ["https://polygon-rpc.com"],

                    nativeCurrency: {

                        name: "MATIC",

                        symbol: "MATIC",

                        decimals: 18,

                    },

                    blockExplorerUrls: ["https://polygonscan.com/"],

                },

            ];

            break;

        //Polygon testnet

        case 80001:

            networkData = [

                {

                    chainId: numberToHex(id),

                    chainName: "Matic Mumbai",

                    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],

                    nativeCurrency: {

                        name: "MATIC",

                        symbol: "MATIC",

                        decimals: 18,

                    },

                    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],

                },

            ];

            break;

        default:

            break;

    }

    // agregar red o cambiar red

    return window.ethereum.request({

        method: "wallet_addEthereumChain",

        params: networkData,

    });

}

const WEI_IN_ETH = 1000000000000000000n;

export function ethToWei(amount: number): BigNumber {
    const big = BigNumber.from(amount);
    return big.mul(WEI_IN_ETH);
}
export function WeiToEth(amount: number): BigNumber {
    const big = BigNumber.from(amount);
    return big.div(WEI_IN_ETH);
}

export function formatWei(amount?: string): string {
    if (!amount || amount === '' || amount === '0') {
        return '0';
    }
    const big = BigNumber.from(amount);
    if (big.gte(WEI_IN_ETH)) {
        return `${big.div(WEI_IN_ETH).toString()} ${process.env.REACT_APP_CURRENCY}`;
    }
    else {
        return `${amount} wei`;
    }
}