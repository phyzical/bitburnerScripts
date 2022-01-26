/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    while (ns.hacknet.getPurchaseNodeCost() <= ns.getPlayer().money) {
        ns.hacknet.purchaseNode()
    }

    for (var i = 0; i < ns.hacknet.numNodes(); i++) {
        while (ns.hacknet.getCoreUpgradeCost(i, 1) <= ns.getPlayer().money) {
            ns.hacknet.upgradeCore(i, 1)
        }

        while (ns.hacknet.getRamUpgradeCost(i, 1) <= ns.getPlayer().money) {
            ns.hacknet.upgradeRam(i, 1)
        }
    }

    for (var i = 0; i < ns.hacknet.numNodes(); i++) {
        while (ns.hacknet.getLevelUpgradeCost(i, 1) <= ns.getPlayer().money) {
            ns.hacknet.upgradeLevel(i, 1)
        }
    }
}