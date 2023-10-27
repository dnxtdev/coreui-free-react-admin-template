import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Wallet from './Wallet.js'
import WalletContext from './WalletContext.js'

const WalletProvider = ({ children }) => {
  const wallet = Wallet() // use your Wallet hook here

  // if you need to perform any side effects, do them here with useEffect

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}

// This is where you define your prop types
WalletProvider.propTypes = {
  children: PropTypes.node, // 'node' covers anything that can be rendered: numbers, strings, elements, or an array containing these types
}

export default WalletProvider

// Custom hook to use the Wallet context
export const useWallet = () => {
  return useContext(WalletContext)
}
