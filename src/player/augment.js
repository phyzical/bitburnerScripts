/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    if ((ns.getOwnedAugmentations(true).length - ns.getOwnedAugmentations().length) >= 30) {
        ns.installAugmentations()
    }
}