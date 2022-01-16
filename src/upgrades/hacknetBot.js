/** @param {import("globals").NS } ns */
export async function main(ns) {
    let earlyGame = true
    while (1) {
        if (ns.getPlayer().money > 200000) {
            earlyGame = false
        }

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

        let mins = earlyGame ? 0.5 : 5

        await ns.sleep(1000 * 60 * mins)
    }
}