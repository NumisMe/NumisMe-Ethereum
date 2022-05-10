const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    let {
        CRVETHPOOL,
        CVXETHPOOL,
        FRAXCRV,
        WETH,
        deployer,
        convexBoost,
        FRAXStableSwap,
        unirouter,
        sushirouter,
        USDC,
        FRAXPOOL,
        CONTROLLER,
        MANAGER
    } = await getNamedAccounts();
    
    const name = 'NumisMe Convex Strategy: FRAXCRV';
    let pid = 32;

    const routers = [sushirouter, unirouter]; // sushi, uni routers

    const Strategy = await deploy('FraxConvexStrategy', {
        contract: 'FraxConvexStrategy',
        from: deployer,
        gasLimit: 10000000,
        log: true,
        args: [
            name,
            FRAXCRV,
            CRVETHPOOL,
            CVXETHPOOL,
            WETH,
            pid,
            USDC,
            FRAXPOOL,
            convexBoost,
            FRAXStableSwap,
            CONTROLLER, // controller
            MANAGER, // manager
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
