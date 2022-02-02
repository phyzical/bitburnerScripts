import constants from "util/constants"

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    while (1) {
        // TODO: can we start talking to this so that we have a "brain"
        // things like STOP SPEDNING
        // maybe gangs purge ect
        await gangPurge(ns)
        await moneyPerSecond(ns)
    }
}

async function gangPurge(ns) {}

async function moneyPerSecond(ns) {
    // todo: are we missing anything income wise?
    // yes income from hacks
    const hacknetProduction = [...Array(ns.hacknet.numNodes()).keys()].map(x => {
        return ns.hacknet.getNodeStats(x).production
    })

    const moneyStreams = [
        ns.gang.getGangInformation().moneyGainRate * constants.brain.ticksPerSecond,
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
    await ns.sleep(1000)
    ns.getScriptIncome()

}