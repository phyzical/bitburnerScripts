import constants from "util/constants"

/** @param {import("globals").NS } ns */
export async function main(ns) {
    for (var program of Object.keys(constants.player.programsByLevel)) {
        if (!ns.fileExists(`${program}.exe`) && ns.getPlayer().hacking > constants.player.programsByLevel[program]) {
            ns.createProgram(`${program}.exe`)
            ns.exit()
        }
    }
}