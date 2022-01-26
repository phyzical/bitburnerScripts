/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    if (!ns.gang.inGang()) {
        ns.commitCrime("homicide")
    }
}