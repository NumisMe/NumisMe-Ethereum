const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    let {
        CRVETHPOOL,
        CVXETHPOOL,
        MIM,
        T3CRV,
        stableSwap3Pool,
        MIMCRV,
        WETH,
        deployer,
        convexBoost,
        stableSwapMIMPool,
        unirouter,
        sushirouter
    } = await getNamedAccounts();

    const Manager = await deployments.get('Manager');
    const Controller = await deployments.get('Controller');
    const Vault = await deployments.get('MIM3CRVVault');

    const name = 'NumisMe Convex Strategy: MIM3CRV';
    let pid = 40;

    const routers = [sushirouter, unirouter]; // sushi, uni routers

    const Strategy = await deploy('MIMConvexStrategy', {
        contract: "MIMConvexStrategy",
        from: deployer,
        gasLimit: 10000000,
        log: true,
        args: [
            name,
            MIMCRV,
            CRVETHPOOL,
            CVXETHPOOL,
            WETH,
            MIM,
            T3CRV,
            stableSwap3Pool,
            pid,
            convexBoost,
            stableSwapMIMPool,
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

module.exports.tags = ['eth'];
