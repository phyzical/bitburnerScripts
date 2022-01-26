/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    var target = ns.args[0];

    var maxMoney = ns.args[1];
    var minSecurity = ns.args[2];

    var moneyThresh = maxMoney * 0.7;
    while (true) {
        let money = ns.getServerMoneyAvailable(target)
        let security = ns.getServerSecurityLevel(target)
        if (security > minSecurity) {
            await ns.weaken(target);
        } else if (money < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}