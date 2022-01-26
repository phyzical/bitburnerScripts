import constants from "util/constants"

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    ns.checkFactionInvitations().map(x => ns.joinFaction(x))
    ns.getPlayer().factions
        .forEach(faction => {
            const unlockableUpgrades = ns.getAugmentationsFromFaction(faction)
                .filter(x => !x.includes("NeuroFlux Governor"))
                .filter(x => !ns.getOwnedAugmentations(true).includes(x))
            const unlockableWithRepUpgrades = unlockableUpgrades.filter(x => ns.getFactionRep(faction) >= ns.getAugmentationRepReq(x))
            unlockableWithRepUpgrades
                .filter(x => !ns.getAugmentationPrereq(x).length || ns.getOwnedAugmentations(true).includes(ns.getAugmentationPrereq(x)))
                .forEach(augmentation => {
                    if (ns.getPlayer().money >= ns.getAugmentationPrice(augmentation)) {
                        ns.purchaseAugmentation(faction, augmentation)
                    }
                })
            // means there are some that need rep
            if (unlockableUpgrades.length != unlockableWithRepUpgrades.length) {
                //ns.share()
                ns.workForFaction(faction, constants.factions[faction])
                ns.exit()
            }
        })
}