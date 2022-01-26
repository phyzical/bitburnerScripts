/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    if (ns.getPlayer().money > ns.getUpgradeHomeCoresCost())
        ns.upgradeHomeCores()
    if (ns.getPlayer().money > ns.getUpgradeHomeRamCost())
        ns.upgradeHomeRam()
}