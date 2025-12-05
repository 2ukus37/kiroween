import React from 'react';
import { useWeb3 } from '../hooks/useWeb3';

export const WalletConnect: React.FC = () => {
  const {
    account,
    isConnecting,
    error,
    isConnected,
    isCorrectNetwork,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
  } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && !isCorrectNetwork) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-accent-orange text-sm">Wrong Network</div>
        <button onClick={switchToPolygon} className="btn-secondary text-sm">
          Switch to Polygon
        </button>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-accent-green font-mono text-sm">{formatAddress(account!)}</div>
        <button onClick={disconnectWallet} className="btn-secondary text-sm">
          Disconnect
        </button>
      </div>
    );
  }

  if (!isMetaMaskInstalled) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-accent-orange text-sm">MetaMask not detected</div>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="btn-primary text-sm"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
};
