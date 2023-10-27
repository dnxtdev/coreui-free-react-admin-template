import React from 'react'
import Mint from '../Mint/Mint.js'
import Burn from '../Burn/Burn.js'
import Whitelist from '../Whitelist/Whitelist.js'
import AdminRedeem from '../Redeem/AdminRedeem.js'
import { SwitchToPolygon } from '../Network/SwitchNetwork.js'
import './../../style/app.css'
import { useWallet } from '../Wallet/WalletProvider.js'
import { AppSidebar, AppFooter, AppHeader } from '../index.js'

const DappContent = () => {
  const { connected, connectWallet } = useWallet()

  return (
    <div className="dapp-container">
      {connected ? (
        window.ethereum.chainId === '0x89' ? (
          <div>
            <div className="top-components">
              <Burn />
              <Whitelist />
              <AdminRedeem />
            </div>
            <Mint />
          </div>
        ) : (
          <SwitchToPolygon connectWallet={connectWallet} connected={connected} />
        )
      ) : (
        <button className="button" onClick={() => connectWallet()}>
          Connect
        </button>
      )}
    </div>
  )
}

const Dapp = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <DappContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default Dapp
