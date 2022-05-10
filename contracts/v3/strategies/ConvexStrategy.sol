// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import '../interfaces/IConvexVault.sol';
import './BaseStrategy.sol';
import '../interfaces/ICVXMinter.sol';
import '../interfaces/IHarvester.sol';
import '../interfaces/ExtendedIERC20.sol';

contract ConvexStrategy is BaseStrategy {
    // used for Crv -> weth -> [dai/usdc/usdt] -> 3crv route
    address public immutable crv;
    address public immutable cvx;

    address public immutable crvethPool;
    address public immutable cvxethPool;

    // for add_liquidity via curve.fi to get back 3CRV (use getMostPremium() for the best stable coin used in the route)
    address public immutable dai;
    address public immutable usdc;
    address public immutable usdt;

    uint256 public immutable pid;
    IConvexVault public immutable convexVault;
    IConvexRewards public immutable crvRewards;
    IStableSwap3Pool public immutable stableSwap3Pool;

    constructor(
        string memory _name,
        address _want,
        address _crvethPool,
        address _cvxethPool,
        address _weth,
        address _dai,
        address _usdc,
        address _usdt,
        uint256 _pid,
        IConvexVault _convexVault,
        IStableSwap3Pool _stableSwap3Pool,
        address _controller,
        address _manager,
        address[] memory _routerArray // [0]=Sushiswap, [1]=Uniswap
    ) public BaseStrategy(_name, _controller, _manager, _want, _weth, _routerArray) {
        (, , , address _crvRewards, , ) = _convexVault.poolInfo(_pid);
        crv = ICurvePool(_crvethPool).coins(1);
        cvx = ICurvePool(_cvxethPool).coins(1);
        dai = _dai;
        usdc = _usdc;
        usdt = _usdt;
        pid = _pid;
        convexVault = _convexVault;
        crvRewards = IConvexRewards(_crvRewards);
        stableSwap3Pool = _stableSwap3Pool;
        crvethPool = _crvethPool;
        cvxethPool = _cvxethPool;
        // Required to overcome "Stack Too Deep" error
        _setApprovals(
            _want,
            _crvethPool,
            _cvxethPool,
            _dai,
            _usdc,
            _usdt,
            address(_convexVault),
            address(_stableSwap3Pool)
        );
    }

    function _setApprovals(
        address _want,
        address _crvethPool,
        address _cvxethPool,
        address _dai,
        address _usdc,
        address _usdt,
        address _convexVault,
        address _stableSwap3Pool
    ) internal {
        IERC20(ICurvePool(_crvethPool).coins(1)).safeApprove(_crvethPool, 0);
        IERC20(ICurvePool(_crvethPool).coins(1)).safeApprove(_crvethPool, type(uint256).max);
        IERC20(ICurvePool(_cvxethPool).coins(1)).safeApprove(_cvxethPool, 0);
        IERC20(ICurvePool(_cvxethPool).coins(1)).safeApprove(_cvxethPool, type(uint256).max);
        IERC20(_want).safeApprove(address(_convexVault), type(uint256).max);
        IERC20(_dai).safeApprove(address(_stableSwap3Pool), type(uint256).max);
        IERC20(_usdc).safeApprove(address(_stableSwap3Pool), type(uint256).max);
        IERC20(_usdt).safeApprove(address(_stableSwap3Pool), type(uint256).max);
        IERC20(_want).safeApprove(address(_stableSwap3Pool), type(uint256).max);
    }

    function _deposit() internal override {
        convexVault.depositAll(pid, true);
    }

    function _claimReward() internal {
        crvRewards.getReward(address(this), true);
    }

    function _addLiquidity(uint256 _estimate) internal {
        uint256[3] memory amounts;
        amounts[0] = IERC20(dai).balanceOf(address(this));
        amounts[1] = IERC20(usdc).balanceOf(address(this));
        amounts[2] = IERC20(usdt).balanceOf(address(this));
        stableSwap3Pool.add_liquidity(amounts, _estimate);
    }

    function getMostPremium() public view returns (address, uint256) {
        uint256[] memory balances = new uint256[](3);
        balances[0] = stableSwap3Pool.balances(0); // DAI
        balances[1] = stableSwap3Pool.balances(1).mul(10**12); // USDC
        balances[2] = stableSwap3Pool.balances(2).mul(10**12); // USDT

        if (balances[0] < balances[1] && balances[0] < balances[2]) {
            // DAI
            return (dai, 0);
        }

        if (balances[1] < balances[0] && balances[1] < balances[2]) {
            // USDC
            return (usdc, 1);
        }

        if (balances[2] < balances[0] && balances[2] < balances[1]) {
            // USDT
            return (usdt, 2);
        }

        return (dai, 0); // If they're somehow equal, we just want DAI
    }

    function _harvest(uint256[] calldata _estimates) internal override {
        _claimReward();
        uint256 _cvxBalance = IERC20(cvx).balanceOf(address(this));
        if (_cvxBalance > 0) {
            _swapTokensCurve(cvxethPool, 1, 0, _cvxBalance, 1);
        }

        uint256 _crvBalance = IERC20(crv).balanceOf(address(this));
        if (_crvBalance > 0) {
            _swapTokensCurve(crvethPool, 1, 0, _crvBalance, 1);
        }
        uint256 _remainingWeth = _payHarvestFees();
        if (_remainingWeth > 0) {
            (address _stableCoin, ) = getMostPremium(); // stablecoin we want to convert to
            _swapTokens(weth, _stableCoin, _remainingWeth, 1);
            _addLiquidity(_estimates[0]);

            if (balanceOfWant() > 0) {
                _deposit();
            }
        }
    }

    function _withdrawAll() internal override {
        convexVault.withdrawAll(pid);
    }

    function _withdraw(uint256 _amount) internal override {
        convexVault.withdraw(pid, _amount);
    }

    function balanceOfPool() public view override returns (uint256) {
        return IERC20(address(crvRewards)).balanceOf(address(this));
    }
}
