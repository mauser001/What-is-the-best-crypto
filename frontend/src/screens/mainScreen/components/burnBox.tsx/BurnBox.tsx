import { BigNumber } from "ethers";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Box from "../../../../components/box/Box";
import CustomButton from "../../../../components/customButton/CustomButton";
import ErrorLabel from "../../../../components/errorLabel/ErrorLabel";
import { notEmptyOrNull } from "../../../../helper/mathHelper";
import { formatWei, sameAddress } from "../../../../helper/web3Helper";
import { useAppDispatch } from "../../../../hooks/hooks";
import { Account } from "../../../../models/Account";
import { burnTokens, getTokenBalance } from "../../../../reducer/blockchainSlice";
import { RootState } from "../../../../store/store";
import HighScoreList from "../highScoreList/HighScoreList";
import style from './BurnBox.module.css';

const BurnBox: FC<{}> = () => {
    const dispatch = useAppDispatch();
    const { accounts, userAddress, tokenBalance, highestBurnedAmount, theBestCrypto } = useSelector((state: RootState) => state.blockchain);
    const [userAccount, setUserAccount] = useState<Account | undefined>();
    const [newBest, setNewBest] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    let burnEnabled = false, willBeHighestBurner = false, isHighestBurner = false;
    if (!!userAddress && notEmptyOrNull(tokenBalance) && userAccount && highestBurnedAmount) {
        willBeHighestBurner = BigNumber.from(userAccount.burnedTokens || 0).add(BigNumber.from(tokenBalance)).gt(BigNumber.from(highestBurnedAmount));
        isHighestBurner = userAccount.burnedTokens === highestBurnedAmount;
        burnEnabled = !isLoading && !!userAddress && notEmptyOrNull(tokenBalance) && (!willBeHighestBurner || notEmptyOrNull(newBest))
    }

    useEffect(() => {
        setError('');
        if (userAddress) {
            const found = accounts?.find(account => sameAddress(account.address, userAddress));
            setUserAccount(found);
            dispatch(getTokenBalance(userAddress));
        }
    }, [userAddress, accounts])

    const burn = async () => {
        setError('');
        setIsLoading(true);
        const result = await dispatch(burnTokens(tokenBalance!, willBeHighestBurner ? newBest : (theBestCrypto || ''), userAddress!));
        if (result !== true) {
            setError(result)
        }
        setIsLoading(false);
    }

    const newBestChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewBest(event.target.value);
    }

    const title = isHighestBurner ? 'You burned most tokens' : 'You already burned tokens';

    return (<Box>
        {userAddress ? (
            <div>
                <label>Burned tokens</label>
                <h3>{title}: {formatWei(userAccount?.burnedTokens)}</h3>
                <h3>You have {formatWei(tokenBalance)} to burn</h3>
                <ErrorLabel errorText={error} />
                <div>
                    {willBeHighestBurner &&
                        <div className={style.inputBox}>
                            <span>The best crypto is: </span>
                            <input
                                type={'text'}
                                maxLength={10}
                                value={newBest}
                                onChange={newBestChanged} />
                        </div>
                    }
                    <CustomButton
                        enabled={burnEnabled}
                        label="Burn my tokens"
                        onClick={burn}
                    />
                </div>
            </div>
        ) : (<div>No account connected</div>)}
        <HighScoreList property="burnedTokens" />
    </Box>)
}

export default BurnBox;