const { ethers } = require("hardhat");

async function main() {

  const Harvester = await ethers.getContractAt('Harvester', "0x00aA9F91E83CFeFBd7F80E34A8d1D2A3C5C29Ea5");

  await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x633Db21C73594FBB1cD0DC8829682874f35aD8EF"],
    });
  const signer = await ethers.provider.getSigner(
      "0x633Db21C73594FBB1cD0DC8829682874f35aD8EF"
    );

  await Harvester.connect(signer).harvest("0x6dB53Ed036135f2c299d54353b2ae7e748a85628", "0x123Fa7E8Acf2Da4fB6e5c096B59310f196495971", [100000000]);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
