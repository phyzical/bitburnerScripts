export default {
    cities: ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"],
    factions: {
        "CyberSec": "Hacking Contracts",
        "Tian Di Hui": "Hacking Contracts",
        "Netburners": "Hacking Contracts",
        "Sector-12": "Hacking Contracts",
        "Chongquin": "Hacking Contracts",
        "New Tokyo": "Hacking Contracts",
        "Ishima": "Hacking Contracts",
        "Aevum": "Hacking Contracts",
        "Volhaven": "Hacking Contracts",
        "NiteSec": "Hacking Contracts",
        "The Black Hand": "Hacking Contracts",
        "BitRunners": "Hacking Contracts",
        "MegaCorp": "Hacking Contracts",
        "Blade Industries": "Hacking Contracts",
        "Four Sigma": "Hacking Contracts",
        "KuaiGong International": "Hacking Contracts",
        "NWO": "Hacking Contracts",
        "OmniTek Incorporated": "Hacking Contracts",
        "ECorp": "Hacking Contracts",
        "Bachman & Associates": "Hacking Contracts",
        "Clarke Incorporated": "Hacking Contracts",
        "Fulcrum Secret Technologies": "Hacking Contracts",
        "Slum Snakes": "Hacking Contracts",
        "Tetrads": "Hacking Contracts",
        "Silhouette": "Hacking Contracts",
        "Speakers for the Dead": "Hacking Contracts",
        "The Dark Army": "Hacking Contracts",
        "The Syndicate": "Hacking Contracts",
        "The Covenant": "Hacking Contracts",
        "Daedalus": "Hacking Contracts",
        "Illuminati": "Hacking Contracts",
    },
    player: {
        programsByLevel: {
            BruteSSH: 50,
            FTPCrack: 100,
            relaySMTP: 250,
            HTTPWorm: 500,
            SQLInject: 750,
            DeepscanV1: 75,
            DeepscanV2: 400,
            ServerProfiler: 75,
            AutoLink: 25
        },
        programsByCost: {
            BruteSSH: 500000,
            FTPCrack: 1500000,
            relaySMTP: 5000000,
            HTTPWorm: 30000000,
            SQLInject: 250000000,
            ServerProfiler: 500000,
            DeepscanV1: 500000,
            DeepscanV2: 25000000,
            AutoLink: 1000000,
            Formulas: 5000000000,
        },
        stats: {
            gym: ["strength", "agility", "dexterity", "defense"],
            university: ["charisma", "hacking"]
        },
        university: {
            city: "Volhaven",
            name: "ZB Institute of Technology",
            hacking: "Algorithms",
            charisma: "Leadership"
        },
        gym: {
            city: "Sector-12",
            name: "Iron Gym",
        },
    },
    corporation: {
        division: {
            upgrades: [
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
            ],
            types: [
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
            ],
        },
        upgrades: [
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
        ],
        singleUpgrades: [
            "Export",
            "Smart Supply",
            "Market Research - Demand",
            "Market Data - Competition",
            "VeChain",
            "Shady Accounting",
            "Government Partnership",
        ],
        materialWeights: {
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
        },
        formulas: {
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
    },
    brain: {
        saveForCorporation: 100000000, // 100 m p/s
        ticksPerSecond: 5 // 100 m p/s
    },
    scripts: {
        corporation: [
            "/corp/assign.js",
            "/corp/manager.js"
        ],
        gang: [
            "/gang/assign.js",
            "/gang/equipment.js"
        ],
        player: [
            "/player/backdoor.js",
            "/player/programs.js",
            "/player/train.js",
            "/player/crime.js",
            "/player/factions.js",
            "/player/work.js",
            "/player/travel.js",
            "/player/augment.js",
        ],
        upgrades: [
            "/upgrades/home.js",
            "/upgrades/programs.js",
            "/upgrades/servers.js",
            "/upgrades/hacknet.js"
        ]
    }

}