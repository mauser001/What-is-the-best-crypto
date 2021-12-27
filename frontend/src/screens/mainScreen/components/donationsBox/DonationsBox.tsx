import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Box from "../../../../components/box/Box";
import CustomButton from "../../../../components/customButton/CustomButton";
import ErrorLabel from "../../../../components/errorLabel/ErrorLabel";
import { notEmptyOrNull } from "../../../../helper/mathHelper";
import { formatWei, sameAddress } from "../../../../helper/web3Helper";
import { useAppDispatch } from "../../../../hooks/hooks";
import { Account } from "../../../../models/Account";
import { sendDonation } from "../../../../reducer/blockchainSlice";
import { RootState } from "../../../../store/store";
import HighScoreList from "../highScoreList/HighScoreList";

const DonationsBox: FC<{}> = () => {
    const dispatch = useAppDispatch();
    const { accounts, userAddress, highestDonationAmount } = useSelector((state: RootState) => state.blockchain);
    const [userAccount, setUserAccount] = useState<Account | undefined>();
    const [donationAmount, setDonationAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const isHighestDoner = notEmptyOrNull(userAccount?.donations) && userAccount?.donations === highestDonationAmount;
    const prevUserDonation = useRef('');

    useEffect(() => {
        setError('');
        if (userAddress) {
            const found = accounts?.find(account => sameAddress(account.address, userAddress));
            setUserAccount(found);
        }
    }, [userAddress, accounts]);

    useEffect(() => {
        if (userAccount) {
            if (userAccount.donations !== prevUserDonation.current) {
                setIsLoading(false);
                prevUserDonation.current = userAccount.donations;
            }
        }
    }, [userAccount]);

    const donate = async () => {
        setError('');
        setIsLoading(true);
        prevUserDonation.current = userAccount!.donations;
        const result = await dispatch(sendDonation(donationAmount, userAddress!));
        if (result !== true) {
            setIsLoading(false);
            setError(result);
        }
    }

    const donationEnabled = !!userAddress && donationAmount > 0 && !isLoading;
    const buttonLabel = isLoading ? '... loading' : 'Donate';

    const donationAmountChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        if (!isNaN(newValue)) {
            setDonationAmount(newValue);
        }
    }

    const title = isHighestDoner ? 'Your are the highest doner with ' : 'You already donated:';
    return (<Box>
        {userAddress ? (
            <div>
                <label>Donations</label>
                <h3>{title} {formatWei(userAccount?.donations)}</h3>
                <ErrorLabel errorText={error} />
                {
                    !isLoading ?
                        <div>
                            <input type={'number'} value={donationAmount} onChange={donationAmountChanged} />
                            <CustomButton enabled={donationEnabled} label={buttonLabel} onClick={donate} />
                        </div> :
                        <div>... processing ...</div>
                }
            </div>
        ) : (<div>No account connected</div>)}
        <HighScoreList property="donations" />
    </Box>)
}

export default DonationsBox;