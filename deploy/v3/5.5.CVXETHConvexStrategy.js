const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    let {
        CRVETHPOOL,
        CVXETHCRV,
        WETH,
        deployer,
        convexBoost,
        CVXETHPOOL,
        unirouter,
        sushirouter
    } = await getNamedAccounts();

    const Manager = await deployments.get('Manager');
    const Controller = await deployments.get('Controller');
    const Vault = await deployments.get('CVXETHCRVVault');
    
    const name = 'NumisMe Convex Strategy: CVXETHCRV';
    let pid = 64;

    const routers = [sushirouter, unirouter]; // sushi, uni routers

    const Strategy = await deploy('CVXETHConvexStrategy', {
        contract: 'CVXETHConvexStrategy',
        from: deployer,
        gasLimit: 10000000,
        log: true,
        args: [
            name,
            CVXETHCRV,
            CRVETHPOOL,
            CVXETHPOOL,
            WETH,
            pid,
            2,
            convexBoost,
            CVXETHPOOL,
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
