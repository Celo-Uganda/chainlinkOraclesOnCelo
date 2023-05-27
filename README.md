here is the buy me coffee contract, add it to packages/hardhat/contracts

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

// Example deployed to Goerli: 0xDBa03676a2fBb6711CB652beF5B7416A53c1421D

contract BuyMeCoffee {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable owner;

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the memo to storage!
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev modifier function to restrict access to only owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}
```

to deploy the contract, add the following to packages/hardhat/scripts/deployBuyMeCoffee.js

```javascript
const hre = require("hardhat")

async function main() {

  const Contract = await hre.ethers.getContractFactory("BuyMeCoffee")
  const contract = await Contract.deploy()

  await contract.deployed()

  console.log("contract deployed to:", contract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```
now, use npx Hardhat to deploy the contract to the celo alfajores testnet

```bash
npx hardhat run --network alfajores scripts/deployBuyMeCoffee.js
```
to verify the contract, run the following command

```bash
npx hardhat verify --network alfajores <contract address>
```
