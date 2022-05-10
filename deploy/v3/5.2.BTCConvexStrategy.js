const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    let {
        CRVETHPOOL,
        CVXETHPOOL,
        RENCRV,
        WETH,
        deployer,
        convexBoost,
        stableSwapBTCPool,
        unirouter,
        sushirouter,
        CONTROLLER,
        MANAGER
    } = await getNamedAccounts();

    const name = 'NumisMe Convex Strategy: RENBTC';
    let pid = 6;

    const routers = [sushirouter, unirouter]; // sushi, uni routers

    const Strategy = await deploy('BTCConvexStrategy', {
        contract: "BTCConvexStrategy",
        from: deployer,
        gasLimit: 10000000,
        log: true,
        args: [
            name,
            RENCRV,
            CRVETHPOOL,
            CVXETHPOOL,
            WETH,
            pid,
            2,
            convexBoost,
            stableSwapBTCPool,
            1,
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
