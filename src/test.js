/** @param {import("globals").NS } ns */
export async function main(ns) {
    ["Mining", "Energy", "Agriculture", "Fishing", "Utilities"].forEach(y => {
        (ns.corporation.getDivision(y).products.forEach(x => ns.corporation.discontinueProduct(y, x)))
    })
}