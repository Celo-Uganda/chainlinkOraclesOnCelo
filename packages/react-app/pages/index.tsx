import { ethers } from "ethers"
import { useAccount, useProvider, useSigner } from "wagmi"
import abi from "./abi.json"
export default function Home() {
  const { data: signer, isError, isLoading } = useSigner();
  const contract = new ethers.Contract("0x48f2602973b58b3DA9181F838405C90497cA002F", abi, signer)

  function handleMint() {
    const value = contract.mintingPrice()
    contract.mint(1, {value: value })
  }
  return (
    <div>
      <div className="h1">There you go... a canvas for your next Celo project!</div>
      <div style={{marginTop:"20px"}}>
      <button style={{border:"1px solid black", padding:"5px", borderRadius:'5px'}} onClick={handleMint}>MINT BUTTON</button>
      </div>
    </div>
  )
}

