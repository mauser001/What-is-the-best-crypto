import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { addContractListeners, removeAllContractListeners } from "../../helper/web3Helper";
import { useAppDispatch } from "../../hooks/hooks";
import { getAccounts, STATE } from "../../reducer/blockchainSlice";
import { RootState } from "../../store/store";
import BurnBox from "./components/burnBox.tsx/BurnBox";
import DonationsBox from "./components/donationsBox/DonationsBox";
import MainHeader from "./components/mainHeader/MainHeader";
import RulesBox from "./components/rulesBox/RulesBox";

const MainScreen: FC<{}> = () => {
    const dispatch = useAppDispatch();
    const { networkState, } = useSelector((state: RootState) => state.blockchain);

    const getData = async () => {
        const result = await dispatch(getAccounts());
        console.log(`accounts loaded: ${result}`);
    }

    const onEvent = () => {
        console.log('onEvent');
        getData();
    }

    useEffect(() => {
        if (networkState === STATE.connected) {
            getData();
            addContractListeners(onEvent);
            return () => {
                removeAllContractListeners();
            }
        }
    }, [networkState]);

    return (<div>
        <MainHeader />
        <DonationsBox />
        <BurnBox />
        <RulesBox />
    </div>)
}

export default MainScreen;