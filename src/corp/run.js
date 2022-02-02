import constants from "util/constants"
import {
    log,
} from "util/helpers"
const LOG_FILE = 'corporation-log.txt'

const UPGRADE_THRESHOLD = 5 / 100
const PRODUCT_THRESHOLD = 10 / 100
const STOCK_THRESHOLD = 1 / 100

/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    let i = 0
    while (1) {
        if (ns.getPlayer().hasCorporation || ns.getPlayer().money >= 150000000000) {
            await manager(ns)
            if (i % 30 == 0)
                await assign(ns)
            i++
        }

        await ns.sleep(1000 * 60)
    }
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function manager(ns) {
    ns.getPlayer().hasCorporation || ns.corporation.createCorporation("Corporation", ns.getPlayer().bitNodeN != 3)
    await log(ns, LOG_FILE, "purchasing divisions")
    await purchaseDivisions(ns)
    await log(ns, LOG_FILE, "purchasing company upgrades")
    await purchaseCompanyUpgrades(ns)

    for (let division of ns.corporation.getCorporation().divisions) {
        await log(ns, LOG_FILE, `division: ${division.name} ##################`)
        await log(ns, LOG_FILE, "purchasing division upgrades")
        await purchaseDivisionUpgrades(ns, division.name)
        await log(ns, LOG_FILE, "adding and removing products")
        await addRemoveProducts(ns, division.name)
        const cities = division.cities
        for (let city of cities) {
            await log(ns, LOG_FILE, `city: ${city} !!!!!!!!!!!!!!!!!!`)
            await log(ns, LOG_FILE, "purchasing warehouses")
            await purchaseWarehouses(ns, division.name, city)
            await buyBoostMaterials(ns, division.name, city)
        }
        await log(ns, LOG_FILE, "setting prices")
        await setSellPrices(ns, division.name, cities[0])
    }
    await handleStocks(ns)
}


/** @param {import("NetscriptDefinitions").NS } ns */
async function handleStocks(ns) {
    const moneyPerTick = ns.corporation.getCorporation().revenue - ns.corporation.getCorporation().expenses
    if (!ns.corporation.getCorporation().public && (moneyPerTick > 1000000000)) {
        ns.corporation.goPublic(500000000)
    }
    if (ns.corporation.getCorporation().public) {
        if (moneyPerTick > 1000000000000000) {
            ns.corporation.issueDividends(0.75)
        } else if (moneyPerTick > 1000000000000) {
            ns.corporation.issueDividends(0.50)

        } else if (moneyPerTick > 1000000000) {
            ns.corporation.issueDividends(0.25)
        }

        //todo if we get ability to buyback
        // if ((ns.getPlayer().money * STOCK_THRESHOLD) > ns.corporation.getCorporation().sharePrice) {
        //     ns.corporation.buyShares()
        // }
    }
}


/** @param {import("NetscriptDefinitions").NS } ns */
async function buyBoostMaterials(ns, divisionName, city) {
    let boostMaterial = constants.corporation.formulas[divisionName].boost
    ns.corporation.buyMaterial(divisionName, city, boostMaterial, 0)
    ns.corporation.sellMaterial(divisionName, city, boostMaterial, "MAX", 0)
    await ns.sleep(1)

    // if (ns.corporation.hasResearched(divisionName, "Bulk Purchasing")) {
    //     let inputSpaceWeightPerTick = Object.keys(constants.corporation.formulas[divisionName].input)
    //         .reduce((acc, materialName) => acc + (constants.corporation.formulas[divisionName].input[materialName] * MATERIAL_WEIGHTS[materialName]), 0)
    //     //assuming it produces 1
    //     let materialInputSpaceWeightPerTick = inputSpaceWeightPerTick * constants.corporation.formulas[divisionName].output
    //         .reduce((acc, materialName) => acc + (ns.corporation.getMaterial(divisionName, city, materialName).prod), 0)

    //     let materialProductionSpacePerTick = constants.corporation.formulas[divisionName].output
    //         .reduce((acc, materialName) => acc + (ns.corporation.getMaterial(divisionName, city, materialName).prod * MATERIAL_WEIGHTS[materialName]), 0)

    //     //assuming it produces 1
    //     let productProductionSpacePerTick = ns.corporation
    //         .getDivision(divisionName)
    //         .products
    //         .reduce((acc, productName) => acc +
    //             (ns.corporation.getProduct(divisionName, productName).cityData[city][1] * inputSpaceWeightPerTick), 0)

    //     const maxSpacePerTick = (materialInputSpaceWeightPerTick + productProductionSpacePerTick) > (materialProductionSpacePerTick + productProductionSpacePerTick) ?
    //         materialInputSpaceWeightPerTick + productProductionSpacePerTick : materialProductionSpacePerTick + productProductionSpacePerTick
    //     const warehouse = ns.corporation.getWarehouse(divisionName, city)
    //     let amount = (warehouse.size - ((maxSpacePerTick * 2) + warehouse.sizeUsed)) / MATERIAL_WEIGHTS[boostMaterial]
    //     // todo can we work out optimal boost material if array is added
    //     // todo if/when we can bulk purchase
    //     // okay now its buying but i think were getting too much so its blocking production
    //     ns.corporation.sellMaterial(divisionName, city, boostMaterial, 0, 0)
    //     amount
    //     if (amount > 0) {
    //         while (ns.corporation.getMaterial(divisionName, city, boostMaterial).qty < (amount / 3)) {
    //             ns.corporation.buyMaterial(divisionName, city, boostMaterial, Math.floor(amount / 10))
    //             await ns.sleep(1)
    //         }
    //     }
    //     ns.corporation.buyMaterial(divisionName, city, boostMaterial, 0)
    // }
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function setSellPrices(ns, divisionName, city) {
    //sell materials
    ns.corporation.setSmartSupply(divisionName, city, true)
    constants.corporation.formulas[divisionName].output.forEach(material => {
        ns.corporation.sellMaterial(divisionName, city, material, "MAX", "MP", true)
        if (ns.corporation.hasResearched(divisionName, "Market-TA.I")) {
            ns.corporation.setMaterialMarketTA1(divisionName, city, material, true)
        }
        if (ns.corporation.hasResearched(divisionName, "Market-TA.II")) {
            ns.corporation.setMaterialMarketTA2(divisionName, city, material, true)
        }
    })
    await ns.sleep(1)
    //sell products
    ns.corporation
        .getDivision(divisionName)
        .products.forEach(product => {
            if (ns.corporation.getProduct(divisionName, product).developmentProgress >= 100 ||
                ns.corporation.hasResearched(divisionName, "Upgrade: Dashboard")
            ) {
                ns.corporation.sellProduct(divisionName, city, product, "MAX", "MP", true)
                if (ns.corporation.hasResearched(divisionName, "Market-TA.I")) {
                    ns.corporation.setProductMarketTA1(divisionName, product, true)
                }
                if (ns.corporation.hasResearched(divisionName, "Market-TA.II")) {
                    ns.corporation.setProductMarketTA2(divisionName, product, true)
                }
            }
        })
    await ns.sleep(1)
}


/** @param {import("NetscriptDefinitions").NS } ns */
async function purchaseWarehouses(ns, divisionName, city) {
    // warehouse upgrades
    if (!ns.corporation.hasWarehouse(divisionName, city))
        ns.corporation.purchaseWarehouse(divisionName, city)
    await log(ns, LOG_FILE, ns.corporation.hasWarehouse(divisionName, city))
    while (ns.corporation.getUpgradeWarehouseCost(divisionName, city) < (UPGRADE_THRESHOLD * ns.corporation.getCorporation().funds)) {
        ns.corporation.upgradeWarehouse(divisionName, city)
        await ns.sleep(1)
    }
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function purchaseDivisions(ns) {
    // buy divisions
    constants.corporation.division.types
        .filter(x => !ns.corporation.getCorporation().divisions.find(y => y.name == x))
        .map(division => {
            if (ns.corporation.getExpandIndustryCost(division) < ns.corporation.getCorporation().funds) {
                return ns.corporation.expandIndustry(division, division)
            }
        })
    // buy constants.cities
    ns.corporation.getCorporation().divisions.map(division => constants.cities
        .filter(city => !division.constants.cities.includes(city))
        .map(city => ns.corporation.expandCity(division.name, city))
    )
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function purchaseCompanyUpgrades(ns) {
    constants.corporation.singleUpgrades.filter(x => !ns.corporation.hasUnlockUpgrade(x))
        .forEach(upgrade => {
            if (ns.corporation.getUnlockUpgradeCost(upgrade) < ns.corporation.getCorporation().funds) {
                ns.corporation.unlockUpgrade(upgrade)
            }
        })
    await ns.sleep(1)
    constants.corporation.upgrades.forEach(upgrade => {
        while (ns.corporation.getUpgradeLevelCost(upgrade) < (UPGRADE_THRESHOLD * ns.corporation.getCorporation().funds)) {
            ns.corporation.levelUpgrade(upgrade)
        }
    })
    await ns.sleep(1)
}


/** @param {import("NetscriptDefinitions").NS } ns */
async function purchaseDivisionUpgrades(ns, divisionName) {
    //advert
    while (ns.corporation.getHireAdVertCost(divisionName) < (UPGRADE_THRESHOLD * ns.corporation.getCorporation().funds)) {
        ns.corporation.hireAdVert(divisionName)
        await ns.sleep(1)
    }

    //division upgrades
    const divisionUpgrades = await getPurchasableDivisionUpgrades(ns, divisionName)

    divisionUpgrades.forEach(upgrade => {
        const division = ns.corporation.getDivision(divisionName)
        if (ns.corporation.getResearchCost(division.name, upgrade) < division.research) {
            ns.corporation.research(division.name, upgrade)
        }
    })
    await ns.sleep(1)
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function addRemoveProducts(ns, divisionName) {
    let division = ns.corporation.getDivision(divisionName)
    if (division.makesProducts) {
        let maxProducts = division.products.length
        if (ns.corporation.hasResearched(divisionName, "uPgrade: Capacity.II")) {
            maxProducts = 5
        } else if (ns.corporation.hasResearched(divisionName, "uPgrade: Capacity.I")) {
            maxProducts = 4
        }

        //remove Products
        if (division.products.length == maxProducts) {
            division.products.forEach(product => {
                if (ns.corporation.getProduct(division.name, product).developmentProgress >= 100 && ns.corporation.getProduct(division.name, product).dmd < 5) {
                    ns.corporation.discontinueProduct(division.name, product)
                }
            })
        }

        //create products
        division = ns.corporation.getDivision(divisionName)
        if (division.products.length < maxProducts) {
            let cities = constants.cities.filter(x => !division.products.includes(x))
            for (let i = 0; i < (maxProducts - division.products.length); i++) {
                let product = cities.pop()
                let investment = PRODUCT_THRESHOLD * ns.corporation.getCorporation().funds
                ns.corporation.makeProduct(division.name, product, product, investment, investment)
                await ns.sleep(1)
            }
        }
    }
}

async function getPurchasableDivisionUpgrades(ns, divisionName) {
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


/** @param {import("NetscriptDefinitions").NS } ns */
async function assign(ns) {
    for (let division of ns.corporation.getCorporation().divisions) {
        await log(ns, LOG_FILE, `division: ${division.name} ##################`)
        for (let city of division.cities) {
            await log(ns, LOG_FILE, `${city} !!!!!`)
            await log(ns, LOG_FILE, "handling offices")
            await handleOffice(ns, division.name, city)
        }
    }
}

/** @param {import("NetscriptDefinitions").NS } ns */
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

/** @param {import("NetscriptDefinitions").NS } ns */
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