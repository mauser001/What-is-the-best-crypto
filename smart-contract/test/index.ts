import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function tryCatch(promise: Promise<any>, message: string) {
  try {
    await promise;
    console.log("hmm no error for-> " + message);
    throw null;
  }
  catch (error: any) {
    assert.equal(error != null, true, "no error for -> " + message);
    assert.equal(error.message.indexOf(message) >= 0, true, "Expected an error message: " + message + "|not found in->" + error.message);
  }
};

const testMoney = 100000000000000;

describe("WhatIsTheBest", function () {
  it("When a donations are made, then we should get the correct values from the donations", async function () {
    const [addr1, addr2] = await ethers.getSigners();
    const WhatIsTheBest = await ethers.getContractFactory("WhatIsTheBest");
    const whatIsTheBest = await WhatIsTheBest.deploy();
    await whatIsTheBest.deployed();

    const addr1Connected = await whatIsTheBest.connect(addr1);
    await addr1Connected.donate({ from: addr1.address, value: testMoney });
    const addr2Connected = await whatIsTheBest.connect(addr2);
    await addr2Connected.donate({ from: addr2.address, value: testMoney });
    await addr2Connected.donate({ from: addr2.address, value: testMoney });

    expect(await addr2Connected.balanceOf(addr2.address)).to.equal(testMoney * 2);


    const doners = await whatIsTheBest.doners();

    expect(doners.length).to.equal(2);

    const donations = await whatIsTheBest.donations(doners);
    expect(donations[0]).to.equal(testMoney);
    expect(donations[1]).to.equal(testMoney * 2);
    expect(await addr2Connected.totalDonations()).to.equal(testMoney * 3);
  });

  it("When funds are burned with a new best crypto, then everything should burned correctly and the new best crypto should be set", async function () {
    const bestCrypto = 'NEW BEST';
    const [addr1] = await ethers.getSigners();
    const WhatIsTheBest = await ethers.getContractFactory("WhatIsTheBest");
    const whatIsTheBest = await WhatIsTheBest.deploy();
    await whatIsTheBest.deployed();

    const addr1Connected = await whatIsTheBest.connect(addr1);
    await addr1Connected.donate({ from: addr1.address, value: testMoney });

    expect(await addr1Connected.balanceOf(addr1.address)).to.equal(testMoney);

    await addr1Connected.burn(testMoney, bestCrypto, { from: addr1.address });

    expect(await addr1Connected.balanceOf(addr1.address)).to.equal(0);


    const burnedTokens = await whatIsTheBest.burnedTokens([addr1.address]);
    expect(burnedTokens[0]).to.equal(testMoney);

    expect(await addr1Connected.theBest()).to.equal(bestCrypto);
  });

  it("When the second address does not burn more tokens, then the best crypto should not be changed", async function () {
    const bestCrypto = 'BEST';
    const ignoreBestCrypto = 'NEW BEST';
    const [addr1, addr2] = await ethers.getSigners();
    const WhatIsTheBest = await ethers.getContractFactory("WhatIsTheBest");
    const whatIsTheBest = await WhatIsTheBest.deploy();
    await whatIsTheBest.deployed();

    const addr1Connected = await whatIsTheBest.connect(addr1);
    await addr1Connected.donate({ from: addr1.address, value: testMoney });
    await addr1Connected.burn(testMoney, bestCrypto, { from: addr1.address });

    expect(await addr1Connected.theBest()).to.equal(bestCrypto);

    const addr2Connected = await whatIsTheBest.connect(addr2);
    await addr2Connected.donate({ from: addr2.address, value: testMoney });
    await addr2Connected.burn(10, ignoreBestCrypto, { from: addr2.address });

    expect(await addr2Connected.theBest()).to.equal(bestCrypto);
    expect(await addr2Connected.highestBurnedAmount()).to.equal(testMoney);
  });

  it("When user donates more then he has, then an error should be thrown", async function () {
    const [addr1] = await ethers.getSigners();
    const WhatIsTheBest = await ethers.getContractFactory("WhatIsTheBest");
    const whatIsTheBest = await WhatIsTheBest.deploy();
    await whatIsTheBest.deployed();

    const addr1Connected = await whatIsTheBest.connect(addr1);
    await tryCatch(addr1Connected.donate({ from: addr1.address, value: (BigNumber.from(testMoney).pow(2)) }), "sender doesn't have enough funds to send tx");
  });

  it("When user burns more tokens then he has, then an error should be thrown", async function () {
    const [addr1] = await ethers.getSigners();
    const WhatIsTheBest = await ethers.getContractFactory("WhatIsTheBest");
    const whatIsTheBest = await WhatIsTheBest.deploy();
    await whatIsTheBest.deployed();

    const addr1Connected = await whatIsTheBest.connect(addr1);
    await addr1Connected.donate({ from: addr1.address, value: 10 });
    await tryCatch(addr1Connected.burn(20, 'NOT', { from: addr1.address }), "burn amount exceeds balance");
  });
});
