import {
    log,
    sliceIntoChunks
} from "util/helpers"
import {
    CITIES,
    COMPANY_UPGRADES,
    DIVISION_TYPES,
    FORMULAS,
    getPurchasableDivisionUpgrades,
    PRODUCT_THRESHOLD,
    SINGLE_COMPANY_UPGRADES,
    UPGRADE_THRESHOLD
} from "corp/run"

const LOG_FILE = 'corporation-log.txt'

/** @param {import("globals").NS } ns */
export async function main(ns) {
    ns.corporation.getCorporation() || ns.corporation.createCorporation("Corporation", false)
    while (1) {
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
        await ns.sleep(1000 * 60)
    }
}


/** @param {import("globals").NS } ns */
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


/** @param {import("globals").NS } ns */
async function buyBoostMaterials(ns, divisionName, city) {
    let boostMaterial = FORMULAS[divisionName].boost
    ns.corporation.buyMaterial(divisionName, city, boostMaterial, 0)
    ns.corporation.sellMaterial(divisionName, city, boostMaterial, "MAX", 0)
    await ns.sleep(1)

    // if (ns.corporation.hasResearched(divisionName, "Bulk Purchasing")) {
    //     let inputSpaceWeightPerTick = Object.keys(FORMULAS[divisionName].input)
    //         .reduce((acc, materialName) => acc + (FORMULAS[divisionName].input[materialName] * MATERIAL_WEIGHTS[materialName]), 0)
    //     //assuming it produces 1
    //     let materialInputSpaceWeightPerTick = inputSpaceWeightPerTick * FORMULAS[divisionName].output
    //         .reduce((acc, materialName) => acc + (ns.corporation.getMaterial(divisionName, city, materialName).prod), 0)

    //     let materialProductionSpacePerTick = FORMULAS[divisionName].output
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

/** @param {import("globals").NS } ns */
async function setSellPrices(ns, divisionName, city) {
    //sell materials
    ns.corporation.setSmartSupply(divisionName, city, true)
    FORMULAS[divisionName].output.forEach(material => {
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


/** @param {import("globals").NS } ns */
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

/** @param {import("globals").NS } ns */
async function purchaseDivisions(ns) {
    // buy divisions
    DIVISION_TYPES
        .filter(x => !ns.corporation.getCorporation().divisions.find(y => y.name == x))
        .map(division => {
            if (ns.corporation.getExpandIndustryCost(division) < ns.corporation.getCorporation().funds) {
                return ns.corporation.expandIndustry(division, division)
            }
        })
    // buy cities
    ns.corporation.getCorporation().divisions.map(division => CITIES
        .filter(city => !division.cities.includes(city))
        .map(city => ns.corporation.expandCity(division.name, city))
    )
}

/** @param {import("globals").NS } ns */
async function purchaseCompanyUpgrades(ns) {
    SINGLE_COMPANY_UPGRADES.filter(x => !ns.corporation.hasUnlockUpgrade(x))
        .forEach(upgrade => {
            if (ns.corporation.getUnlockUpgradeCost(upgrade) < ns.corporation.getCorporation().funds) {
                ns.corporation.unlockUpgrade(upgrade)
            }
        })
    await ns.sleep(1)
    COMPANY_UPGRADES.forEach(upgrade => {
        while (ns.corporation.getUpgradeLevelCost(upgrade) < (UPGRADE_THRESHOLD * ns.corporation.getCorporation().funds)) {
            ns.corporation.levelUpgrade(upgrade)
        }
    })
    await ns.sleep(1)
}


/** @param {import("globals").NS } ns */
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

/** @param {import("globals").NS } ns */
async function addRemoveProducts(ns, divisionName) {
    let division = ns.corporation.getDivision(divisionName)

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
        let productCities = CITIES.filter(x => !division.products.includes(x))
        for (let i = 0; i < (maxProducts - division.products.length); i++) {
            let product = productCities.pop()
            let investment = PRODUCT_THRESHOLD * ns.corporation.getCorporation().funds
            ns.corporation.makeProduct(division.name, product, product, investment, investment)
            await ns.sleep(1)
        }
    }
}