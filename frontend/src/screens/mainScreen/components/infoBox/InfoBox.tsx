import { FC } from "react";
import Box from "../../../../components/box/Box";
import style from './InfoBox.module.css';

const InfoBox: FC<{}> = () => {

    return (
        <Box>
            <h3>Additional infos</h3>
            <ul className={style.listStyle}>
                <li>The {process.env.REACT_APP_CHAIN_NAME} network is used to save gas costs</li>
                <li>All donations are final and cannot be reverted</li>
                <li>The smart contract can not be modified, even the donation address is hard coded, to prevent fraud</li>
                <li>Use at your own risk. </li>
                <li><a href="https://github.com/mauser001/What-is-the-best-crypto" target="_blank" rel="noreferrer">Link to source code on github</a></li>
                <li><a href="https://polygonscan.com/address/{{process.env.REACT_APP_SMART_CONTRACT_ADDRESS} }" target="_blank" rel="noreferrer" >View smart contract on polygonscan.com</a></li>
            </ul>
        </Box>
    )
}

export default InfoBox;