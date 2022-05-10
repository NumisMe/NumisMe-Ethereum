module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    const { deployer, YAXIS, YAXISAVAXLP } = await getNamedAccounts();

    const RewardsMinter = await deploy('RewardsMinter', {
        from: deployer,
        log: true,
        args: [YAXIS]
    });

    const Rewards = await deploy('Rewards', {
        from: deployer,
        log: true,
        args: [YAXISAVAXLP, RewardsMinter.address]
    });

    if (RewardsMinter.newlyDeployed) {
        await execute(
            'RewardsMinter',
            { from: deployer, log: true },
            'setMinter',
            Rewards.address
        );
    }
};

module.exports.tags = ['avax'];
