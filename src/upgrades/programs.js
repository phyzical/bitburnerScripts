import constants from "util/constants"

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    if (!ns.getPlayer().tor) {
        await ns.purchaseTor()
    }

    if (ns.getPlayer().tor) {
        for (var program of Object.keys(constants.player.programsByCost)) {
            if (!ns.fileExists(`${program}.exe`) && ns.getPlayer().money > constants.player.programsByCost[program]) {
                ns.purchaseProgram(`${program}.exe`)
            }
        }
    }
}