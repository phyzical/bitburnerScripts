import constants from "util/constants"

/** @param {import("globals").NS } ns */
export async function main(ns) {
    const statTrainingCap = 125
    const trainableStats = constants.player.stats.gym
        .concat(constants.player.stats.university)
        .reduce((acc, x) => {
            if (ns.getPlayer()[x] < statTrainingCap) {
                acc.push(x)
            }
            return acc
        }, [])
    if (constants.player.stats.gym.includes(trainableStats[0])) {
        const gym = constants.player.gym
        ns.travelToCity(gym.city)
        ns.gymWorkout(gym.name, trainableStats[0])
    } else if (constants.player.stats.university.includes(trainableStats[0])) {
        const university = constants.player.university
        ns.travelToCity(university.city)
        ns.universityCourse(university.name, university[trainableStats[0]])
    }
}