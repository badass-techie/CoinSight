import {EACAggregatorProxy} from "../generated/BTC/EACAggregatorProxy"
import {Price} from "../generated/schema"
import {Address, BigInt, dataSource, ethereum} from "@graphprotocol/graph-ts";


export function handlePriceUpdateBTC(block: ethereum.Block): void {
    handlePriceUpdate("BTC/USD", dataSource.address());
}

export function handlePriceUpdateETH(block: ethereum.Block): void {
    handlePriceUpdate("ETH/USD", dataSource.address());
}

export function handlePriceUpdateLINK(block: ethereum.Block): void {
    handlePriceUpdate("LINK/USD", dataSource.address());
}

export function handlePriceUpdateXAU(block: ethereum.Block): void {
    handlePriceUpdate("XAU/USD", dataSource.address());
}

export function handlePriceUpdate(tokenName: string, tokenAddress: Address): void {
    let contract = EACAggregatorProxy.bind(tokenAddress);
    let result = contract.try_latestRoundData();

    if (!result.reverted) {
        let roundId = result.value.getRoundId();

        let price = new Price(roundId.toString())
        price.token = tokenName
        price.price = result.value.getAnswer()
        price.decimals = BigInt.fromI32(8)
        price.timestamp = result.value.getUpdatedAt()
        price.save()

        for (let round = roundId; round.gt(roundId.minus(BigInt.fromI32(5000))); round = round.minus(BigInt.fromI32(500))) {
            let roundData = contract.try_getRoundData(round);
            if (!roundData.reverted) {
                let price = new Price(round.toString())
                price.token = tokenName
                price.price = roundData.value.getAnswer()
                price.decimals = BigInt.fromI32(8)
                price.timestamp = roundData.value.getUpdatedAt()
                price.save()
            }
        }
    }
}
