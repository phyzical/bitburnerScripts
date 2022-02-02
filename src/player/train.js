import constants from "util/constants"

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    const statTrainingCap = 100
    const trainableStats = constants.player.stats.gym
        .concat(constants.player.stats.university)
        .filter((x) => ns.getPlayer()[x] < statTrainingCap)
    if (constants.player.stats.gym.includes(trainableStats[0])) {
        const gym = constants.player.gym
        ns.travelToCity(gym.city)
        ns.gymWorkout(gym.name, trainableStats[0], false)
    } else if (constants.player.stats.university.includes(trainableStats[0])) {
        const university = constants.player.university
        ns.travelToCity(university.city)
        ns.universityCourse(university.name, university[trainableStats[0]], false)
    }
}