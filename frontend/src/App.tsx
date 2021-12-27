import { useEffect } from 'react';
import './App.css';
import { useAppDispatch } from './hooks/hooks';
import { ethers } from 'ethers';
import { getUserAccount, setState, STATE } from './reducer/blockchainSlice';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import StateContainer from './components/stateContainer/StateContainer';
import MainScreen from './screens/mainScreen/MainScreen';

function App() {
  const dispatch = useAppDispatch();
  const { networkState: state } = useSelector((state: RootState) => state.blockchain);


  const checkProvider = async () => {
    if (!window.ethereum || !window.ethereum.isConnected()) {
      dispatch(setState(STATE.notConnected));
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    console.log(`network.chainId: ${network.chainId}`);
    if (network.chainId.toString() !== process.env.REACT_APP_CHAIN_ID) {
      dispatch(setState(STATE.wrongNetwork));
    }
    else {
      dispatch(setState(STATE.connected));
      checkUserAccount();
    }
  }

  const checkUserAccount = async () => {
    dispatch(getUserAccount());
  }

  const setDisconnected = () => {
    dispatch(setState(STATE.notConnected));
  }

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.on('accountsChanged', checkUserAccount);

      window.ethereum.on('chainChanged', checkProvider);
      window.ethereum.on('connect', checkProvider);
      window.ethereum.on('disconnect', setDisconnected);

      checkProvider();
    }
    else {
      dispatch(setState(STATE.noProvider));
      console.log(`no metamask connected`);
    }
    return () => {
      window.ethereum.removeListener('accountsChanged', checkUserAccount);
      window.ethereum.removeListener('chainChanged', checkProvider);
      window.ethereum.removeListener('connect', checkProvider);
      window.ethereum.removeListener('accountsdisconnectChanged', setDisconnected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <StateContainer state={state}>
        <MainScreen></MainScreen>
      </StateContainer>
    </div>
  );
}

export default App;
