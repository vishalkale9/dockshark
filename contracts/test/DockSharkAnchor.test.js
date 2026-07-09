const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DockSharkAnchor (Hardened)", function () {
  let anchorContract;
  let owner;
  let otherAccount;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    otherAccount = signers[1];

    const DockSharkAnchor = await ethers.getContractFactory("DockSharkAnchor");
    anchorContract = await DockSharkAnchor.deploy();
  });

  it("Should allow the owner to anchor a root", async function () {
    const mockRoot = ethers.hexlify(ethers.randomBytes(32));
    
    await expect(anchorContract.anchorRoot(mockRoot))
      .to.emit(anchorContract, "RootAnchored");

    expect(await anchorContract.isAnchored(mockRoot)).to.be.true;
  });

  it("Should revert when anchoring the same root twice with RootAlreadyAnchored custom error", async function () {
    const mockRoot = ethers.hexlify(ethers.randomBytes(32));
    
    await anchorContract.anchorRoot(mockRoot);
    
    await expect(anchorContract.anchorRoot(mockRoot))
      .to.be.revertedWithCustomError(anchorContract, "RootAlreadyAnchored")
      .withArgs(mockRoot);
  });

  it("Should revert if a non-owner tries to anchor", async function () {
    const mockRoot = ethers.hexlify(ethers.randomBytes(32));
    
    await expect(anchorContract.connect(otherAccount).anchorRoot(mockRoot))
      .to.be.reverted; 
  });

  it("Should revert when anchoring a zero root with InvalidRoot custom error", async function () {
    const zeroRoot = ethers.ZeroHash;
    
    await expect(anchorContract.anchorRoot(zeroRoot))
      .to.be.revertedWithCustomError(anchorContract, "InvalidRoot");
  });

  it("Should allow the owner to batch anchor multiple roots", async function () {
    const roots = [
      ethers.hexlify(ethers.randomBytes(32)),
      ethers.hexlify(ethers.randomBytes(32)),
      ethers.hexlify(ethers.randomBytes(32))
    ];
    
    await expect(anchorContract.anchorRootsBatch(roots))
      .to.emit(anchorContract, "RootAnchored").withArgs(roots[0], require("@nomicfoundation/hardhat-chai-matchers/withArgs").anyValue);

    expect(await anchorContract.isAnchored(roots[0])).to.be.true;
    expect(await anchorContract.isAnchored(roots[1])).to.be.true;
    expect(await anchorContract.isAnchored(roots[2])).to.be.true;
  });

  it("Should allow the owner to pause and unpause the contract", async function () {
    await anchorContract.pause();
    
    const mockRoot = ethers.hexlify(ethers.randomBytes(32));
    await expect(anchorContract.anchorRoot(mockRoot))
      .to.be.reverted; // Pausable: paused
      
    await anchorContract.unpause();
    
    await expect(anchorContract.anchorRoot(mockRoot))
      .to.emit(anchorContract, "RootAnchored");
  });

  it("Should support two-step ownership transfer", async function () {
    await anchorContract.transferOwnership(otherAccount.address);
    
    // Owner should still be original owner until accepted
    expect(await anchorContract.owner()).to.equal(owner.address);
    
    // Other account accepts
    await anchorContract.connect(otherAccount).acceptOwnership();
    
    expect(await anchorContract.owner()).to.equal(otherAccount.address);
  });
});
