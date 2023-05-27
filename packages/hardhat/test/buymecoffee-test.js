const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BuyMeCoffee", function () {
  let contract;
  let owner;
  let addr1;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("BuyMeCoffee");
    contract = await Contract.deploy();
    await contract.deployed();

    [owner, addr1] = await ethers.getSigners();
  });

  it("should create a new memo when buying coffee", async function () {
    const name = "John Doe";
    const message = "Thanks for the coffee!";
    const value = ethers.utils.parseEther("1");

    await expect(contract.buyCoffee(name, message, { value }))
      .to.emit(contract, "NewMemo")
      .withArgs(addr1.address, ethers.utils.BigNumber.from("0"), name, message);

    const memos = await contract.getMemos();
    expect(memos.length).to.equal(1);

    const memo = memos[0];
    expect(memo.from).to.equal(addr1.address);
    expect(memo.timestamp).to.not.equal(0);
    expect(memo.name).to.equal(name);
    expect(memo.message).to.equal(message);
  });

  it("should not allow buying coffee for free", async function () {
    const name = "John Doe";
    const message = "Thanks for the coffee!";
    const value = ethers.utils.parseEther("0");

    await expect(contract.buyCoffee(name, message, { value }))
      .to.be.revertedWith("can't buy coffee for free!");

    const memos = await contract.getMemos();
    expect(memos.length).to.equal(0);
  });

  it("should allow the owner to withdraw tips", async function () {
    const value = ethers.utils.parseEther("1");

    await contract.buyCoffee("John Doe", "Thanks for the coffee!", { value });

    const initialBalance = await ethers.provider.getBalance(owner.address);
    await contract.withdrawTips();
    const finalBalance = await ethers.provider.getBalance(owner.address);

    expect(finalBalance.sub(initialBalance)).to.equal(value);
  });
});
