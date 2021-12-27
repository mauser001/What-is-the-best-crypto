import { FC } from "react";
import Box from "../../../../components/box/Box";
import style from './RulesBox.module.css';

const RulesBox: FC<{}> = () => {

    return (
        <Box>
            <h3>Rules of the game </h3>
            <ul className={style.listStyle}>
                <li>All donations go directly to SOS-Kinderdorf</li>
                <li>The donation address is: 0x74e525323217A4472D4db41A116e6Db067cF8b8a
                    <ul>
                        <li><a href="https://www.sos-kinderdorf.at/campaign/cryptodonations" target="_blank" rel="noreferrer">Link to donation site (the Ethereum address is also valid on Polygon)</a></li>
                        <li><a href="https://polygonscan.com/address/0x74e525323217A4472D4db41A116e6Db067cF8b8a" target="_blank" rel="noreferrer">View on polygonscan</a></li>
                    </ul>
                </li>
                <li>Donations are made in MATIC on the Polygon network</li>
                <li>When you donate MATIC you get WITB tokens</li>
                <li>The only thing you can do with WITB tokens is to burn them</li>
                <li>The person who burns the most tokens, can define what the best crypto is</li>
            </ul>
        </Box>
    )
}

export default RulesBox;