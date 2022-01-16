import constants from "util/constants"

/** @param {import("globals").NS } ns */
export async function main(ns) {
    while (1) {
        //todo logic to avoid joining certain factions
        //todo travel for more factions
        ns.checkFactionInvitations().map(x => ns.joinFaction(x))
        ns.getPlayer().factions
            .forEach(faction => {
                //todo filter out nuerolink
                const unlockableUpgrades = ns.getAugmentationsFromFaction(faction)
                    .filter(x => x != "Neurolink")
                    .filter(x => !ns.getOwnedAugmentations().includes(x))
                const unlockableWithRepUpgrades = unlockableUpgrades.filter(x => ns.getFactionRep(faction) >= ns.getAugmentationRepReq(x))
                unlockableWithRepUpgrades
                    .filter(x => ns.getOwnedAugmentations().includes(ns.getAugmentationPrereq(x)))
                    .forEach(augmentation => {
                        if (ns.getPlayer().money < ns.getAugmentationPrice(augmentation)) {
                            ns.purchaseAugmentation(augmentation)
                        }
                    })
                // means there are some that need rep
                if (!ns.getPlayer().isWorking && unlockableUpgrades.length != unlockableWithRepUpgrades.length) {
                    ns.workForFaction(faction, "hacking contract")
                }
            })
        const player = ns.getPlayer()
        const statTrainingCap = 125
        const trainableStats = ["strength", "agility", "dexterity", "defence", "charisma", "hacking"].reduce(acc, x => player[acc] < statTrainingCap ? x : acc, "")
        if (!ns.getPlayer().isWorking && ["strength", "agility", "dexterity", "defence"].includes(trainableStats[0])) {
            const gym = constants.gyms[ns.getPlayer().city]
            // todo add gym constants
            ns.gymWorkout(gym, trainableStats[0])
        }
        if (!ns.getPlayer().isWorking && ["charisma", "hacking"].includes(trainableStats[0])) {
            const university = constants.universities[ns.getPlayer().city]
            ns.universityCourse(university, trainableStats[0])
        }

        if (!ns.getPlayer().isWorking) {
            //crime time
            ns.commitCrime("homicide")
            // do homicide so that we can get a gang asap
            // or work time
            // ns.workForCompany()
        }
        await ns.sleep(1000 * 60 * 15)
    }

}