'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: any;
  }
}

const tokenAddress = '0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d'
const presaleAddress = '0x0fC5025C764cE34df352757e82f7B5c4Df39A836'

export default function Home() {
  const [account, setAccount] = useState('')
  const [price, setPrice] = useState('')
  const [ethValue, setEthValue] = useState('')
  const [neoToReceive, setNeoToReceive] = useState('')

  async function connectWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const addr = await signer.getAddress()
    setAccount(addr)
  }

  async function fetchPrice() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(presaleAddress, ["function currentPrice() public view returns (uint256)"], provider)
    const result = await contract.currentPrice()
    setPrice(ethers.utils.formatEther(result))
  }

  async function buyTokens() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(presaleAddress, ["function buyTokens() public payable"], signer)
    await contract.buyTokens({ value: ethers.utils.parseEther(ethValue) })
    fetchPrice()
  }

  useEffect(() => {
    fetchPrice()
  }, [])

  useEffect(() => {
    if (ethValue && price) {
      const tokens = parseFloat(ethValue) / parseFloat(price)
      setNeoToReceive(tokens.toFixed(2))
    }
  }, [ethValue, price])

  return (
    <main style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', backgroundColor: '#111', borderRadius: '8px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Neuron Presale</h1>
      <p>Current Price: <strong>{price || 'Loading...'} ETH</strong></p>
      <input
        type="number"
        placeholder="ETH amount"
        value={ethValue}
        onChange={(e) => setEthValue(e.target.value)}
        style={{ width: '100%', padding: '10px', margin: '10px 0', color: 'black' }}
      />
      <p>You will receive: {neoToReceive} NEO</p>
      <button onClick={account ? buyTokens : connectWallet}
        style={{ width: '100%', padding: '10px', backgroundColor: 'blue', color: 'white' }}>
        {account ? 'Buy NEO' : 'Connect Wallet'}
      </button>
    </main>
  )
}