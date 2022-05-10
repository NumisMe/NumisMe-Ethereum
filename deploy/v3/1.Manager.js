module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    let { deployer, YAXIS } = await getNamedAccounts();

    await deploy('Manager', {
        from: deployer,
        log: true,
        args: [YAXIS]
    });
};

module.exports.tags = ['avax'];
