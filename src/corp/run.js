/** @param {import("index").NS } ns */
export async function main(ns) {
    let corp = ns.corporation.getCorporation()
    let formulas = {
        Agriculture: {
            input: {
                water: 0.5,
                energy: 0.5,
            },
            output: {
                plant: 1,
                food: 1,
            }
        }
    }
    let divisions = [ns.corporation.getDivision("Agriculture")]

    // cant get corp divisions or upgrades?
    // upgrade corp
    for (let division of divisions) {
        for (let city of division.cities) {
            // hire employees
            while (ns.corporation.hireEmployee(division.name, city)) {}
            // upgrade division
            // division.upgrades if in profit
            // produce
            let inputs = formulas[division.type].input
            let count = 500
            Object.keys(inputs).map(key => {
                ns.corporation.buyMaterial(division.name, city, key, inputs[key] * 500)
            })
            // Object.keys( formulas[division.type].output)
        }
    }
}