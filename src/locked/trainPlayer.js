/** @param {import("index").NS } ns */
export async function main(ns) {
    while (1) {
        //sf4.2
        ns.workForFaction("Netburners", "hacking contract")
        await ns.sleep(1000 * 60 * 60)

        //sf4.1
        ns.gymWorkout("powerhouse gym", "Strength")
        await ns.sleep(1000 * 60 * 15)

        ns.gymWorkout("powerhouse gym", "Defence")
        await ns.sleep(1000 * 60 * 15)

        ns.gymWorkout("powerhouse gym", "Dexterity")
        await ns.sleep(1000 * 60 * 15)

        ns.gymWorkout("powerhouse gym", "Agility")
        await ns.sleep(1000 * 60 * 15)
    }

}