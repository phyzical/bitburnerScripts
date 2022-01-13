import {
    log,
    getEquipment,
    getRandomString,
} from 'util/helpers.js'

/** @param {import("index").NS } ns */
export async function main(ns) {
    if (!ns.gang.inGang()) {
        ns.gang.createGang("Slum Snakes")
    }

    let members = ns.gang.getMemberNames()
    members = members.map(x => ({
        name: x,
        info: ns.gang.getMemberInformation(x)
    }))
    let tasks = ns.gang.getTaskNames()
    tasks.shift()
    let crimes = tasks.splice(0, 9)
    let vigilanteTask = tasks.shift()
    let combatTask = tasks.shift()
    let hackingTask = tasks.shift()
    let charismaTask = tasks.shift()
    let warfareTask = tasks.shift()
    let purge = false
    let workingCount = 0

    while (1) {
        let found = true
        let gangInfo = ns.gang.getGangInformation()
        // i dont understand this enough it just goes down note: if you enable only an augmentation turns it off
        ns.gang.setTerritoryWarfare(false)
        workingCount = 0
        while (found) {
            let name = getRandomString()
            found = ns.gang.recruitMember(name)
            if (found) {
                members.push({
                    name,
                    info: ns.gang.getMemberInformation(name)
                })
            }
        }
        if (gangInfo.wantedLevel > 600) {
            purge = true
        }

        if (gangInfo.wantedLevel < 50) {
            purge = false
        }



        for (let index in members) {
            let member = members[index]
            let info = ns.gang.getMemberInformation(member.name)
            let working = Math.min(...[info.hack_asc_mult, info.cha_asc_mult, info.str_asc_mult]) * 75
            working = working < 500 ? 500 : working
            let prestige = Math.max(...[info.hack_asc_mult, info.cha_asc_mult, info.str_asc_mult]) * 100
            if (info.str > prestige && info.hack > prestige && info.cha > prestige) {
                ns.gang.ascendMember(member.name)
            }
            if ((prestige < working && info.str < prestige) || (prestige > working && info.str < working)) {
                ns.gang.setMemberTask(member.name, combatTask)
            } else if ((prestige < working && info.cha < prestige) || (prestige > working && info.cha < working)) {
                ns.gang.setMemberTask(member.name, charismaTask)
            } else if ((prestige < working && info.hack < prestige) || (prestige > working && info.hack < working)) {
                ns.gang.setMemberTask(member.name, hackingTask)
            } else {
                workingCount++
                let warefare = Math.random() * 100 < 50

                if (warefare && gangInfo.territoryWarfareEngaged && gangInfo.territory < 90) {
                    ns.gang.setMemberTask(member.name, warfareTask)
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


        let allItems = await getEquipment(ns)
        for (let {
                name: member,
                info
            } of members) {

            let currentItems = info.upgrades.concat(info.augmentations).map(x => ({
                name: x,
                type: ns.gang.getEquipmentType(x)
            }))

            for (let type in allItems) {
                let items = allItems[type]
                let currentItem = currentItems.find(x => x.type == type)
                let buyItem = items[0]
                if (currentItem) {
                    buyItem = items[items.findIndex(x => x.name == currentItem.name) + 1]
                }
                if (buyItem && ns.getPlayer().money > buyItem.cost) {
                    ns.gang.purchaseEquipment(member, buyItem.name)
                }
            }
        }
        await ns.sleep(1000 * 60 * 1)
    }
}