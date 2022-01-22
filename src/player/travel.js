import constants from "util/constants"

/** @param {import("globals").NS } ns */
export async function main(ns) {
    if (ns.getPlayer().money > 10000000)
        ns.travelToCity(constants.cities[Math.floor(Math.random() * constants.cities.length)])
}