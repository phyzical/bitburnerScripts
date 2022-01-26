import constants from 'util/constants';
import {
    getRandomString,
} from 'util/helpers.js'

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    while (1) {
        if (!ns.gang.inGang()) {
            ns.gang.createGang("Slum Snakes")
        }

        if (ns.gang.inGang()) {
            // i dont understand this enough it just goes down note: if you enable only an augmentation turns it off
            ns.gang.setTerritoryWarfare(false)
            await recruitMembers(ns)
            for (let script of constants.scripts.gang) {
                ns.exec(script, "home");
                while (ns.scriptRunning(script, "home")) {
                    await ns.sleep(1000 * 1)
                }
                await ns.sleep(1000 * 1)
            }
        }
        await ns.sleep(1000 * 60 * 1)
    }
}

/** @param {import("NetscriptDefinitions").NS } ns */
export async function recruitMembers(ns, ) {
    while (ns.gang.recruitMember(getRandomString())) {
        await ns.sleep(10)
    }
}