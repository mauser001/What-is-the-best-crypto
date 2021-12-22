import { FC, useEffect, useState } from "react";
import { switchNetwork } from "../../helper/web3Helper";
import { STATE } from "../../reducer/blockchainSlice";
import CustomButton from "../customButton/CustomButton";

interface Props {
    state: STATE
}

const StateContainer: FC<Props> = ({ state, children, ...props }) => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const onSwitchNetwork = async () => {
        setErrorMessage(undefined);
        try {
            await switchNetwork(process.env.REACT_APP_CHAIN_ID!);
        } catch (error) {
            setErrorMessage(`Could not change the network, please add / switch to the ${process.env.REACT_APP_CHAIN_NAME} in your metamask manually`);
        }
    }

    useEffect(() => {
        setErrorMessage(undefined);
    }, [state]);

    switch (state) {
        case STATE.connected:
            return (
                <div {...props}>{children}
                </div>
            )
        case STATE.wrongNetwork:
            return (
                <div>
                    Please switch to the {process.env.REACT_APP_CHAIN_NAME} network
                    <CustomButton enabled={true} onClick={onSwitchNetwork} label="Switch network" />
                    {errorMessage && <div>{errorMessage}</div>}
                </div>
            )
        case STATE.noProvider:
            return (
                <div>
                    Please install <a href="https://metamask.io/">Metamask and reload the page</a>
                </div>
            )
        default: return (<div>...loading...</div>)
    }
}

export default StateContainer;