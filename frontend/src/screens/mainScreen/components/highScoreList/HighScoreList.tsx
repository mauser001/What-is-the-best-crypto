import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { sortAccountsBy } from "../../../../helper/mathHelper";
import { formatWei, sameAddress } from "../../../../helper/web3Helper";
import { Account } from "../../../../models/Account";
import { RootState } from "../../../../store/store";
import style from './HighScoreList.module.css';

interface Props {
    property: 'donations' | 'burnedTokens'
}

const HighScoreList: FC<Props> = ({ property }) => {

    const { accounts, userAddress } = useSelector((state: RootState) => state.blockchain);
    const [sorted, setSorted] = useState<Account[]>([]);
    const [showHighscore, setShowHighscore] = useState(false);

    useEffect(() => {
        if (accounts) {
            const clone = accounts.filter(account => account[property] !== '0');
            setSorted(clone.sort(sortAccountsBy(property)))
        }
    }, [accounts, property]);

    const showLabel = showHighscore ? '<- hide' : '-> show';
    const toggleShow = () => {
        setShowHighscore(!showHighscore);
    }

    return (
        <div className={style.container}>
            <h3 onClick={toggleShow} className={style.header}><span>Highscore |</span><span>{showLabel}</span></h3>
            {showHighscore && <table className={style.tableStyle}>
                <tbody>
                    {sorted.length > 0 && sorted.map(acc => (
                        <HighScoreItem
                            key={acc.address}
                            address={acc.address} value={acc[property]}
                            isUserAddress={sameAddress(acc.address, userAddress)} />)
                    )}
                </tbody>
            </table>}
        </div>
    )
}

interface ItemProps {
    address: string,
    value: string,
    isUserAddress: boolean,
}

const HighScoreItem: FC<ItemProps> = ({ address, value, isUserAddress }) => {
    const rowStyle = isUserAddress ? style.userRow : '';
    return (
        <tr className={rowStyle}><td>{address}</td><td>{formatWei(value)}</td></tr>
    )
}

export default HighScoreList;