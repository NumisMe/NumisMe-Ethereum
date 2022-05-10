const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    let {
        CRVETHPOOL,
        CVXETHPOOL,
        ALETHCRV,
        ALETH,
        WETH,
        deployer,
        convexBoost,
        stableSwapALETHPool,
        unirouter,
        sushirouter,
        CONTROLLER,
        MANAGER
    } = await getNamedAccounts();

    const Manager = await deployments.get('Manager');
    const Controller = await deployments.get('Controller');
    const Vault = await deployments.get('ALETHCRVVault');

    const name = 'NumisMe Convex Strategy: ALETHCRV';
    let pid = 49;

    const routers = [sushirouter, unirouter]; // sushi, uni routers

    const Strategy = await deploy('ALETHConvexStrategy', {
        contract: "ETHConvexStrategy",
        from: deployer,
        gasLimit: 10000000,
        log: true,
        args: [
            name,
            ALETHCRV,
            CRVETHPOOL,
            CVXETHPOOL,
            WETH,
            ALETH,
            pid,
            convexBoost,
            stableSwapALETHPool,
            CONTROLLER,
            MANAGER,
            routers
        ]
    });

    await execute(
        'Manager',
        { from: deployer, log: true },
        'setAllowedStrategy(address,bool)',
        Strategy.address,
        true
    );

    await execute(
        'Controller',
        { from: deployer, log: true },
        'addStrategy(address,address,uint256,uint256)',
        Vault.address,
        Strategy.address,
        ethers.utils.parseEther("100000000000"),
        86400
    );
};

module.exports.tags = ['eth'];
