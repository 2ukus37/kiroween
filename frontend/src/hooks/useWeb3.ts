import { useState, useEffect } from 'react';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const POLYGON_CHAIN_ID = '0x89'; // 137 in hex
const MUMBAI_CHAIN_ID = '0x13881'; // 80001 in hex

export const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check for MetaMask with a slight delay to ensure it's loaded
    const checkMetaMask = () => {
      if (typeof window.ethereum !== 'undefined') {
        setIsMetaMaskInstalled(true);
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Check if user manually disconnected
        const isDisconnected = localStorage.getItem('walletDisconnected') === 'true';
        
        if (!isDisconnected) {
          // Check if already connected
          window.ethereum
            .request({ method: 'eth_accounts' })
            .then((accounts: string[]) => {
              if (accounts.length > 0) {
                setAccount(accounts[0]);
              }
            })
            .catch(console.error);
        }

        // Get chain ID
        window.ethereum
          .request({ method: 'eth_chainId' })
          .then((chainId: string) => {
            setChainId(chainId);
          })
          .catch(console.error);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            // Clear disconnect flag when user connects via MetaMask
            localStorage.removeItem('walletDisconnected');
          } else {
            setAccount(null);
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          setChainId(chainId);
          window.location.reload();
        });
      } else {
        setIsMetaMaskInstalled(false);
      }
    };

    // Check immediately
    checkMetaMask();

    // Also check after a short delay (MetaMask might load after page)
    const timer = setTimeout(checkMetaMask, 1000);

    return () => {
      clearTimeout(timer);
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask extension and refresh the page.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setAccount(accounts[0]);
      // Clear disconnect flag when connecting
      localStorage.removeItem('walletDisconnected');

      // Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(chainId);

      if (chainId !== POLYGON_CHAIN_ID && chainId !== MUMBAI_CHAIN_ID) {
        setError('Please switch to Polygon network');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setError(null);
    // Set flag to prevent auto-reconnect on reload
    localStorage.setItem('walletDisconnected', 'true');
  };

  const switchToPolygon = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MUMBAI_CHAIN_ID }], // Use Mumbai for testnet
      });
    } catch (switchError: any) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: MUMBAI_CHAIN_ID,
                chainName: 'Polygon Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          });
        } catch (addError: any) {
          setError('Failed to add Polygon network');
        }
      }
    }
  };

  const isCorrectNetwork = chainId === POLYGON_CHAIN_ID || chainId === MUMBAI_CHAIN_ID;

  return {
    web3,
    account,
    chainId,
    isConnecting,
    error,
    isConnected: !!account,
    isCorrectNetwork,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
  };
};
