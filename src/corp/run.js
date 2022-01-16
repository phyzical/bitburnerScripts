import constants from "util/constants"

export const UPGRADE_THRESHOLD = 5 / 100
export const PRODUCT_THRESHOLD = 10 / 100
export const STOCK_THRESHOLD = 1 / 100

/** @param {import("globals").NS } ns */
export async function main(ns) {
    ns.kill("/corp/manager.js", "home")
    ns.kill("/corp/employeeAssigner.js", "home")
    ns.exec("corp/manager.js", "home")
    while (1) {
        ns.exec("corp/employeeAssigner.js", "home")
        await ns.sleep(1000 * 60 * 30)
    }
}

export async function getPurchasableDivisionUpgrades(ns, divisionName) {
    const hasProducts = ns.corporation.getDivision(divisionName).products.length

    return constants.corporation.division.upgrades
        .filter(x => {
            if (!hasProducts) {
                return ![
                    "uPgrade: Fulcrum", "uPgrade: Capacity.I", "uPgrade: Capacity.II", "uPgrade: Dashboard"
                ].includes(x)
            }
            return true
        })
        .filter(x => !ns.corporation.hasResearched(divisionName, x))
}