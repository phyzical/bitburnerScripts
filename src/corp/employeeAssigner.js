import {
    log
} from "util/helpers"
import {
    getPurchasableDivisionUpgrades,
    UPGRADE_THRESHOLD
} from "corp/run"
export const LOG_FILE = 'corporation-assigner-log.txt'

/** @param {import("globals").NS } ns */
export async function main(ns) {
    for (let division of ns.corporation.getCorporation().divisions) {
        await log(ns, LOG_FILE, `division: ${division.name} ##################`)
        for (let city of division.cities) {
            await log(ns, LOG_FILE, `${city} !!!!!`)
            await log(ns, LOG_FILE, "handling offices")
            await handleOffice(ns, division.name, city)
        }
    }
}

/** @param {import("globals").NS } ns */
async function handleOffice(ns, divisionName, city) {
    //office size
    const divisionUpgrades = await getPurchasableDivisionUpgrades(ns, divisionName)
    const hireCount = divisionUpgrades.length ? 5 : 4
    let thingsChanged = false
    while (ns.corporation.getOfficeSizeUpgradeCost(divisionName, city, hireCount) < (UPGRADE_THRESHOLD * ns.corporation.getCorporation().funds)) {
        ns.corporation.upgradeOfficeSize(divisionName, city, hireCount)
        while (ns.corporation.getOffice(divisionName, city).employees.length < ns.corporation.getOffice(divisionName, city).size) {
            ns.corporation.hireEmployee(divisionName, city)
            await ns.sleep(1)
        }
        thingsChanged = true
    }

    // assign 
    if (thingsChanged) {
        await assignEmployees(ns, divisionName, city, divisionUpgrades.length)
    }
}

/** @param {import("globals").NS } ns */
async function assignEmployees(ns, divisionName, city, hireResearchers) {
    const jobs = [
        "Operations",
        "Engineer",
        "Management",
        "Business",
        "Research & Development"
    ]

    const employees = ns.corporation
        .getOffice(divisionName, city)
        .employees

    const employeesToAssign = employees
        .map(x => ns.corporation.getEmployee(divisionName, city, x))
        .find(x => {
            let tempJobs = ["Unassigned", "Training", ]
            if (!hireResearchers) {
                tempJobs.push("Research & Development")
            }
            return tempJobs.includes(x.pos)
        })

    //reset job positions
    const allJobs = jobs.concat(["Training"])
    for (let i = 0; i < allJobs.length; i++) {
        await ns.corporation.setAutoJobAssignment(divisionName, city, allJobs[i], 0)
    }
    if (!hireResearchers) {
        jobs.pop();
    }
    if (employeesToAssign) {
        let amountPerJob = Math.ceil(employees.length / jobs.length)
        let total = employees.length
        let i = 0

        while (total > 0) {
            if (amountPerJob > total) {
                amountPerJob = ns.corporation
                    .getOffice(divisionName, city)
                    .employees
                    .map(x => ns.corporation.getEmployee(divisionName, city, x))
                    .filter(x => x.pos == "Unassigned").length
                total = 0
            }
            await log(ns, LOG_FILE, `setting autojob ${jobs[i]} ${amountPerJob}`)
            await ns.corporation.setAutoJobAssignment(divisionName, city, jobs[i], amountPerJob)
            total -= amountPerJob
            i++
        }
    }
}