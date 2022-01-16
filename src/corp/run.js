export const CITIES = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"]
export const UPGRADE_THRESHOLD = 5 / 100
export const PRODUCT_THRESHOLD = 10 / 100
export const STOCK_THRESHOLD = 1 / 100
export const MATERIAL_WEIGHTS = {
    Water: 0.05,
    Energy: 0.01,
    Food: 0.03,
    Plants: 0.05,
    Metal: 0.1,
    Hardware: 0.06,
    Chemicals: 0.05,
    Drugs: 0.02,
    Robots: 0.5,
    AICores: 0.1,
    RealEstate: 0.005,
}
export const FORMULAS = {
    "Software": {
        input: {
            Hardware: 0.5,
            Energy: 0.5,
        },
        output: ["AICores"],
        boost: "RealEstate"
    },
    "RealEstate": {
        input: {
            Metal: 5,
            Energy: 5,
            Water: 2,
            Hardware: 4,
        },
        output: ["RealEstate"],
        boost: "AICores"
    },
    "Healthcare": {
        input: {
            Robots: 10,
            Energy: 5,
            Water: 5,
            AICores: 5,
        },
        output: [],
        boost: "RealEstate"
    },
    "Robotics": {
        input: {
            Energy: 3,
            Hardware: 5,
        },
        output: ["Robots"],
        boost: "RealEstate"
    },
    "Tobacco": {
        input: {
            Plants: 1,
            Water: 0.2,
        },
        output: [],
        boost: "Robots"
    },
    "Chemical": {
        input: {
            Plants: 1,
            Energy: 0.5,
            Water: 0.5,
        },
        output: ["Chemicals"],
        boost: "RealEstate"
    },
    "Mining": {
        input: {
            Energy: 0.8,
        },
        output: ["Metal"],
        boost: "AICores"
    },
    "Computer": {
        input: {
            Metal: 2,
            Energy: 1,
        },
        output: ["Hardware"],
        boost: "RealEstate"
    },
    "Food": {
        input: {
            Food: 0.5,
            Energy: 0.2,
            Water: 0.5,
        },
        output: [],
        boost: "AICores"
    },
    "Energy": {
        input: {
            Hardware: 0.1,
            Metal: 0.2,
        },
        output: ["Energy"],
        boost: "RealEstate"
    },
    "Agriculture": {
        input: {
            Water: 0.5,
            Energy: 0.5,
        },
        output: ["Plants", "Food"],
        boost: "RealEstate"
    },
    "Pharmaceutical": {
        input: {
            Chemicals: 2,
            Energy: 1,
            Water: 0.5,
        },
        output: ["Drugs"],
        boost: "AICores"
    },
    "Fishing": {
        input: {
            Energy: 0.5,
        },
        output: ["Food"],
        boost: "Robots"
    },
    "Utilities": {
        input: {
            Energy: 0.5,
        },
        output: ["Water"],
        boost: "RealEstate"
    },
}

export const DIVISION_TYPES = [
    "Software",
    "RealEstate",
    "Healthcare",
    "Robotics",
    "Tobacco",
    "Chemical",
    "Mining",
    "Computer",
    "Food",
    "Energy",
    "Agriculture",
    "Pharmaceutical",
    "Fishing",
    "Utilities"
]

export const DIVISION_UPGRADES = [
    "Market-TA.I",
    "Market-TA.II",
    "uPgrade: Fulcrum",
    "uPgrade: Capacity.I",
    "uPgrade: Capacity.II",
    "uPgrade: Dashboard",
    "Bulk Purchasing",
    "Overclock",
    "Hi-Tech R&D Laboratory",
    "Self-Correcting Assemblers",
    "Sti.mu",
    "Drones",
    "Drones - Assembly",
    "Drones - Transport",
    "HRBuddy-Recruitment",
    "HRBuddy-Training",
    "JoyWire",
    "AutoBrew",
    "AutoPartyManager",
    "Automatic Drug Administration",
    "Go-Juice",
    "CPH4 Injections",
]

export const COMPANY_UPGRADES = [
    "Smart Factories",
    "Wilson Analytics",
    "Neural Accelerators",
    "Project Insight",
    "Smart Storage",
    "Nuoptimal Nootropic Injector Implants",
    "FocusWires",
    "DreamSense",
    "Speech Processor Implants",
    "ABC SalesBots"
]

export const SINGLE_COMPANY_UPGRADES = [
    "Export",
    "Smart Supply",
    "Market Research - Demand",
    "Market Data - Competition",
    "VeChain",
    "Shady Accounting",
    "Government Partnership",
]


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

    return DIVISION_UPGRADES
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