const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    let {
        CRVETHPOOL,
        CVXETHPOOL,
        TRICRYPTO2,
        WETH,
        deployer,
        convexBoost,
        TRICRYPTO2StableSwap,
        unirouter,
        sushirouter
    } = await getNamedAccounts();

    const Manager = await deployments.get('Manager');
    const Controller = await deployments.get('Controller');
    const Vault = await deployments.get('TRICRYPTO2Vault');

    const name = 'NumisMe Convex Strategy: TRICRYPTO2';
    let pid = 38;

    const routers = [sushirouter, unirouter]; // sushi, uni routers

    const Strategy = await deploy('TRICRYPTO2ConvexStrategy', {
        contract: "TRICRYPTO2ConvexStrategy",
        from: deployer,
        gasLimit: 10000000,
        log: true,
        args: [
            name,
            TRICRYPTO2,
            CRVETHPOOL,
            CVXETHPOOL,
            WETH,
            pid,
            2,
            convexBoost,
            TRICRYPTO2StableSwap,
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
