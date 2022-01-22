/** @param {NS} ns **/
export async function main(ns) {
    // please use dev menu to go to BN.3
    // give yourself a pile of cash
    //give corp a bunch of research
    ns.corporation.createCorporation("a", false)
    ns.corporation.goPublic(500000000)
    let shares = ns.corporation.getCorporation().numShares
    ns.corporation.buyBackShares(100000)
    if (shares + 100000 != ns.corporation.getCorporation().numShares) {
        throw new Error("didnt sell shares")
    }
    ns.corporation.sellShares(50000000)
    if (shares - 50000000 + 100000 != ns.corporation.getCorporation().numShares) {
        throw new Error("didnt buyback shares")
    }
    ns.corporation.expandIndustry("Software", "a")
    ns.corporation.expandCity("a", "Sector-12")
    ns.corporation.research("a", "Bulk Purchasing")
    let materials = ns.corporation.getMaterial("a", "Sector-12", "RealEstate").qty
    ns.corporation.bulkPurchase("a", "Sector-12", "RealEstate", 1000)
    if (materials + 1000 != ns.corporation.getMaterial("a", "Sector-12", "RealEstate").qty) {
        throw new Error("didnt buy materials")
    }
}