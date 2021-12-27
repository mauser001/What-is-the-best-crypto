import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import RainbowText from "../../../../components/rainbowText/RainbowText";
import { formatWei } from "../../../../helper/web3Helper";
import { useAppDispatch } from "../../../../hooks/hooks";
import { getTheBestCrypto } from "../../../../reducer/blockchainSlice";
import { RootState } from "../../../../store/store";

const MainHeader: FC<{}> = () => {
    const dispatch = useAppDispatch();
    const { totalDonationAmount, totalBurnedAmount, theBestCrypto } = useSelector((state: RootState) => state.blockchain);

    useEffect(() => {
        dispatch(getTheBestCrypto());
    }, [totalBurnedAmount, dispatch]);

    useEffect(() => {
        if (theBestCrypto) {
            document.title = `${theBestCrypto} is the best`
        }
    }, [theBestCrypto]);

    return (<div>
        <h1>The best Crypto is <RainbowText text={theBestCrypto || '???'} /></h1>
        <h2>And we made <RainbowText text={formatWei(totalDonationAmount)} /> donations to <a href="https://www.sos-kinderdorf.at/" target="_blank" rel="noreferrer">SOS-Kinderdorf</a></h2>
    </div>)
}

export default MainHeader;