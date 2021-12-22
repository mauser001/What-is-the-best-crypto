//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WhatIsTheBest is ERC20 {
    event Donation(address from, uint256 amount, uint256 total);
    event Burn(address from, uint256 amount, uint256 total, bool isHighest);

    mapping(address => uint256) private _burnedTokens;
    uint256 private _highestBurnedAmount;
    mapping(address => uint256) private _donations;
    uint256 private _totalDonations;
    address[] private _doners;
    string private _theBest = "";

    address payable public donationAddress =
        payable(0x74e525323217A4472D4db41A116e6Db067cF8b8a);

    constructor() ERC20("WhatIsTheBest", "WITB") {}

    function donate() public payable {
        require(msg.value > 0, "no founds to donate");
        require(
            msg.sender != donationAddress,
            "no donations from donation address"
        );
        donationAddress.transfer(msg.value);
        _mint(msg.sender, msg.value);
        if (_donations[msg.sender] == 0) {
            _doners.push(msg.sender);
        }
        _donations[msg.sender] += msg.value;
        _totalDonations += msg.value;
        emit Donation(msg.sender, msg.value, _donations[msg.sender]);
    }

    function burn(uint256 amount, string memory best) public {
        require(amount > 0, "nothing to burn ");
        _burn(msg.sender, amount);
        _burnedTokens[msg.sender] += amount;
        if (_burnedTokens[msg.sender] > _highestBurnedAmount) {
            _theBest = best;
            _highestBurnedAmount = _burnedTokens[msg.sender];
            emit Burn(msg.sender, amount, _burnedTokens[msg.sender], true);
        } else {
            emit Burn(msg.sender, amount, _burnedTokens[msg.sender], false);
        }
    }

    function totalDonations() public view returns (uint256) {
        return _totalDonations;
    }

    function highestBurnedAmount() public view returns (uint256) {
        return _highestBurnedAmount;
    }

    function theBest() public view returns (string memory) {
        return _theBest;
    }

    function doners() public view returns (address[] memory) {
        return _doners;
    }

    function donations(address[] calldata donationAdresses)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory list = new uint256[](donationAdresses.length);
        for (uint256 i = 0; i < donationAdresses.length; i++) {
            list[i] = _donations[donationAdresses[i]];
        }
        return list;
    }

    function burnedTokens(address[] calldata donationAdresses)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory list = new uint256[](donationAdresses.length);
        for (uint256 i = 0; i < donationAdresses.length; i++) {
            list[i] = _burnedTokens[donationAdresses[i]];
        }
        return list;
    }

    receive() external payable {
        donate();
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        if (recipient == address(this)) {
            burn(amount, "");
        } else {
            _transfer(_msgSender(), recipient, amount);
        }
        return true;
    }
}
