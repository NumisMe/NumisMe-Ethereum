module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    let { deployer, NUME } = await getNamedAccounts();

    await deploy('Manager', {
        from: deployer,
        log: true,
        args: [NUME]
    });
};

module.exports.tags = ['eth'];
