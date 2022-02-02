import constants from "util/constants"

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    while (1) {
        await gangPurge(ns)
        await moneyPerSecond(ns)
        await ns.sleep(1000)
    }
}

async function gangPurge(ns) {
    let purge = true
    ns.clearPort(2)
    await ns.writePort(2, purge ? "true" : "false")
}

async function moneyPerSecond(ns) {
    // todo: are we missing anything income wise?
    const hacknetProduction = [...Array(ns.hacknet.numNodes()).keys()].map(x => {
        return ns.hacknet.getNodeStats(x).production
    })
    const moneyStreams = [
        ns.gang.getGangInformation().moneyGainRate * constants.brain.ticksPerSecond,
        ns.getScriptIncome() * constants.brain.ticksPerSecond,
        // todo: work out corp profit into player bank
        // ns.corporation.getCorporation().revenue * ns.corporation.getCorporation().,
        ns.getPlayer().workMoneyGainRate * constants.brain.ticksPerSecond,
    ].concat(hacknetProduction)

    const moneyPerTick = moneyStreams.reduce((a, b) => a + b, 0)
    let saveForCorporation = false

    if (!ns.getPlayer().hasCorporation && moneyPerTick > constants.brain.saveForCorporation) {
        saveForCorporation = true
    }

    ns.clearPort(1)
    await ns.writePort(1, saveForCorporation ? "true" : "false")
}