const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Land", () => {
  let land;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Land");
    land = await Contract.deploy();
    await land.deployed();
    [owner, nonOwner, Inspector] = await ethers.getSigners();
  });
  it("constructor", async () => {
    expect(await land.owner()).to.equal(
      await ethers.provider.getSigner(0).getAddress()
    );
    expect(await land.num()).to.equal(1200);
  });

  it("add inspector", async () => {
    const inspector = ethers.Wallet.createRandom().address;
    const aadhar = 123456789012;
    const aadharHash =
      "0x" +
      ethers.utils
        .keccak256(ethers.utils.defaultAbiCoder.encode(["uint256"], [aadhar]))
        .slice(2);

    await expect(land.addInspector(inspector, 12345)).to.be.revertedWith(
      "Input value must be a 12-digit number"
    );

    await expect(
      land.connect(nonOwner).addInspector(inspector, aadhar)
    ).to.be.revertedWith("Only owner has Access");

    await land.connect(owner).addInspector(inspector, aadhar);

    expect(await land.AdharLink(aadharHash)).to.equal(aadhar);
    expect(await land.AdharTOHash(aadhar)).to.equal(aadharHash);
    expect(await land.OnlyOneTime(inspector)).to.equal(true);
    expect(await land.Hash(inspector)).to.equal(aadharHash);
    expect(await land.isInspector(inspector)).to.equal(true);
  });

  it("Owner can't be inspector", async () => {
    const aadhar = 123456789012;
    await expect(
      land.connect(owner).addInspector(owner.address, aadhar)
    ).to.be.revertedWith("Owner can't be inspector");
  });

  it("You have already assigned it as Inspector", async () => {
    const aadhar = 123456789012;
    await land.connect(owner).addInspector(Inspector.address, aadhar);

    await expect(
      land.connect(owner).addInspector(Inspector.address, aadhar)
    ).to.be.revertedWith("You have already assigned it as Inspector");
  });

  it("remove inspector", async () => {
    const inspector = ethers.Wallet.createRandom().address;
    const aadhar = 123456789012;

    await land.addInspector(inspector, aadhar);

    await expect(
      land.connect(nonOwner).removeInspector(inspector)
    ).to.be.revertedWith("Only owner has Access");

    await land.connect(owner).removeInspector(inspector);

    expect(await land.isInspector(inspector)).to.equal(false);
  });

  it("Address is not assigned as Inspector", async () => {
    await expect(
      land.connect(owner).removeInspector(Inspector.address)
    ).to.be.revertedWith("Address is not assigned as Inspector");
  });

  it("link aadhar", async () => {
    const aadhar = 123456789012;
    const aadharHash =
      "0x" +
      ethers.utils
        .keccak256(ethers.utils.defaultAbiCoder.encode(["uint256"], [aadhar]))
        .slice(2);

    await land.connect(nonOwner).linkAadhar(aadhar);

    expect(await land.AdharLink(aadharHash)).to.equal(aadhar);
    expect(await land.AdharTOHash(aadhar)).to.equal(aadharHash);
    expect(await land.OnlyOneTime(nonOwner.address)).to.equal(true);
    expect(await land.Hash(nonOwner.address)).to.equal(aadharHash);
  });

  it("should fail if the Aadhar number has already been linked", async function () {
    const aadhar = 123456789012;

    await land.linkAadhar(aadhar);

    await expect(land.connect(nonOwner).linkAadhar(aadhar)).to.be.revertedWith(
      "This aadhar number has already been linked"
    );
  });

  it("should fail if the address has already linked an Aadhar number", async function () {
    const aadharNo1 = 123456789012;
    const aadharNo2 = 123456789013;

    await land.linkAadhar(aadharNo1);

    await expect(land.linkAadhar(aadharNo2)).to.be.revertedWith(
      "One Address can only be link to one Aadhar"
    );
  });

  it("CheckInspector", async () => {
    const aadhar = 123456789012;
    await land.addInspector(nonOwner.address, aadhar);

    expect(await land.connect(nonOwner).CheckInspector()).to.equal(true);
  });

  it("check owner", async () => {
    const a = await land.connect(owner).Owner();
    expect(a).to.equal(true);
  });

  it("measure land", async () => {
    const coordinates = "(a,b),(c,d)";
    const num = 1200;
    const currentAadhar = 123456789013;
    const inspectorAadhar = 123456789012;

    await land.connect(owner).addInspector(Inspector.address, inspectorAadhar);
    await land.connect(nonOwner).linkAadhar(currentAadhar);

    await land.connect(Inspector).MeasureLand(coordinates, nonOwner.address);

    expect(await land.landAdded(coordinates)).to.equal(true);
  });

  it("Only Inspector can access this function", async () => {
    const coordinates = "(a,b),(c,d)";
    await expect(
      land.connect(Inspector).MeasureLand(coordinates, nonOwner.address)
    ).to.be.revertedWith("Only Inspector can access this function");
  });

  it("Aadhar must be linked", async () => {
    const aadhar = 123456789012;
    const coordinates = "(a,b),(c,d)";
    await land.connect(owner).addInspector(Inspector.address, aadhar);

    await expect(
      land.connect(Inspector).MeasureLand(coordinates, nonOwner.address)
    ).to.be.revertedWith("Aadhar must be linked");
  });

  it("You are already owner", async () => {
    aadharI = 123456789012;
    aadharC = 123456789013;
    const coordinates = "(a,b),(c,d)";

    await land.connect(owner).addInspector(Inspector.address, aadharI);
    await land.connect(nonOwner).linkAadhar(aadharC);
    await land.connect(Inspector).MeasureLand(coordinates, nonOwner.address);

    await expect(
      land.connect(Inspector).MeasureLand(coordinates, nonOwner.address)
    ).to.be.revertedWith("You are already owner");
  });

  it("inspector can't measure his own land", async () => {
    aadharI = 123456789012;
    const coordinates = "(a,b),(c,d)";

    await land.connect(owner).addInspector(nonOwner.address, aadharI);

    await expect(
      land.connect(nonOwner).MeasureLand(coordinates, nonOwner.address)
    ).to.be.revertedWith("inspector can't measure his own land");
  });

  it("check previous inspector", async () => {
    const num = 1200;
    aadharI = 123456789012;
    aadharC = 123456789013;
    const coordinates = "(a,b),(c,d)";

    await land.connect(owner).addInspector(Inspector.address, aadharI);
    await land.connect(nonOwner).linkAadhar(aadharC);
    await land.connect(Inspector).MeasureLand(coordinates, nonOwner.address);

    expect(await land.CheckPreviousInspector(num)).to.eql([
      await land.Hash(Inspector.address),
    ]);
  });

  it("CheckPreviousOwner", async () => {
    const num = 1200;
    aadharI = 123456789012;
    aadharC = 123456789013;
    const coordinates = "(a,b),(c,d)";

    await land.connect(owner).addInspector(Inspector.address, aadharI);
    await land.connect(nonOwner).linkAadhar(aadharC);
    await land.connect(Inspector).MeasureLand(coordinates, nonOwner.address);

    expect(await land.CheckPreviousOwner(num)).to.eql([
      await land.Hash(nonOwner.address),
    ]);
  });

  it("FetchLandRecords", async () => {
    const num = 1200;
    aadharI = 123456789012;
    aadharC = 123456789013;
    const coordinates = "(a,b),(c,d)";

    await land.connect(owner).addInspector(Inspector.address, aadharI);
    await land.connect(nonOwner).linkAadhar(aadharC);
    await land.connect(Inspector).MeasureLand(coordinates, nonOwner.address);

    const result = await land.FetchLandRecords(num);

    expect(result.land_id).to.equal(num);
    expect(result.coordinates).to.equal(coordinates);
    expect(result.LastInspector).to.equal(await land.Hash(Inspector.address));
    expect(result.CurrentOwner).to.equal(await land.Hash(nonOwner.address));
  });
});
