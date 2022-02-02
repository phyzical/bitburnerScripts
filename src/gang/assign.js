/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    let tasks = ns.gang.getTaskNames()
    tasks.shift()
    let crimes = tasks.splice(0, 9)
    let [vigilanteTask, combatTask, hackingTask, charismaTask, warfareTask] = tasks

    let purge = true
    if (ns.gang.getGangInformation().wantedPenalty > 0.3) {
        purge = false
    }

    let members = ns.gang
        .getMemberNames()
        .map(x => ({
            name: x,
            info: ns.gang.getMemberInformation(x)
        }))
    let workingCount = 0
    // TODO: change to focus down to type of gang i.e comabt vs hacking
    // wasted efforts
    for (let index in members) {
        let member = members[index]
        let info = ns.gang.getMemberInformation(member.name)
        let working = Math.min(...[info.hack_asc_mult, info.cha_asc_mult, info.str_asc_mult]) * 75
        working = working < 500 ? 500 : working
        let prestige = Math.max(...[info.hack_asc_mult, info.cha_asc_mult, info.str_asc_mult]) * 100
        // acsend if stats are at the next threshold
        if (info.str > prestige && info.hack > prestige && info.cha > prestige) {
            ns.gang.ascendMember(member.name)
        }
        // train combat
        if ((prestige < working && info.str < prestige) || (prestige > working && info.str < working)) {
            ns.gang.setMemberTask(member.name, combatTask)
            // train charisma
        } else if ((prestige < working && info.cha < prestige) || (prestige > working && info.cha < working)) {
            ns.gang.setMemberTask(member.name, charismaTask)
            // train hacking
        } else if ((prestige < working && info.hack < prestige) || (prestige > working && info.hack < working)) {
            ns.gang.setMemberTask(member.name, hackingTask)
        } else {
            workingCount++
            let warfare = Math.random() * 100 < 50

            // do some gang warefare
            if (warfare && ns.gang.getGangInformation().territoryWarfareEngaged && ns.gang.getGangInformation().territory < 90) {
                ns.gang.setMemberTask(member.name, warfareTask)
                // we have too much wanted level lets ditch it
            } else if (purge) {
                ns.gang.setMemberTask(member.name, vigilanteTask)
            } else {
                let bestCrime = crimes.map(crime => {
                    let crimeStats = ns.gang.getTaskStats(crime)
                    return {
                        name: crime,
                        money: (crimeStats.baseMoney * crimeStats.chaWeight * info.cha) +
                            (crimeStats.baseMoney * crimeStats.strWeight * info.str) +
                            (crimeStats.baseMoney * crimeStats.hackWeight * info.hack) +
                            (crimeStats.baseMoney * crimeStats.agiWeight * info.agi) +
                            (crimeStats.baseMoney * crimeStats.defWeight * info.def) +
                            (crimeStats.baseMoney * crimeStats.dexWeight * info.dex)
                    }
                }).sort((a, b) => b.money - a.money)[0]
                ns.gang.setMemberTask(member.name, bestCrime.name)
            }
        }
    }
}