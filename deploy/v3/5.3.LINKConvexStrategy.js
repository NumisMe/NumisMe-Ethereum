const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    let {
        CRVETHPOOL,
        CVXETHPOOL,
        LINKCRV,
        WETH,
        deployer,
        convexBoost,
        stableSwapLINKPool,
        unirouter,
        sushirouter
    } = await getNamedAccounts();

    const Manager = await deployments.get('Manager');
    const Controller = await deployments.get('Controller');
    const Vault = await deployments.get('LINKCRVVault');

    const name = 'NumisMe Convex Strategy: LINKCRV';
    let pid = 30;

    const routers = [sushirouter, unirouter]; // sushi, uni routers

    const Strategy = await deploy('LINKConvexStrategy', {
        contract: "GeneralConvexStrategy",
        from: deployer,
        gasLimit: 10000000,
        log: true,
        args: [
            name,
            LINKCRV,
            CRVETHPOOL,
            CVXETHPOOL,
            WETH,
            pid,
            2,
            convexBoost,
            stableSwapLINKPool,
            0,
            Controller.address,
            Manager.address,
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

module.exports.tags = ['unused'];
