// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract NFTContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    uint public mintPrice; //0.1 USD
    AggregatorV3Interface internal dataFeed;

    Counters.Counter private _tokenIdCounter;

    constructor(uint _mintPrice) ERC721("CELODEVSMEETUP", "CDM") {
        mintPrice = _mintPrice;
        dataFeed = AggregatorV3Interface(
            0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946
        );
    }

    function safeMint(address to) public payable onlyOwner {
        require(msg.value > mintPrice, "price less than mintprice");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
        function getLatestData() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

}

}
