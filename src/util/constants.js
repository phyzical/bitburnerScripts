export default {
    cities: ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"],
    universities: {
        "Aevum": "",
        "Chongqing": "",
        "Sector-12": "",
        "New Tokyo": "",
        "Ishima": "",
        "Volhaven": ""
    },
    factions: [
        "CyberSec",
        "Tian Di Hui",
        "Netburners",
        "Sector-12",
        "Chongquin",
        "New Tokyo",
        "Ishima",
        "Aevum",
        "Volhaven",
        "NiteSec",
        "The Black Hand",
        "BitRunners",
        "MegaCorp",
        "Blade Industries",
        "Four Sigma",
        "KuaiGong International",
        "NWO",
        "OmniTek Incorporated"
        "ECorp",
        "Bachman & Associates",
        "Clarke Incorporated",
        "Fulcrum Secret Technologies",
        "Slum Snakes",
        "Tetrads",
        "Silhouette",
        "Speakers for the Dead",
        "The Dark Army",
        "The Syndicate",
        "The Covenant",
        "Daedalus",
        "Illuminati"
    ],
    gyms: {
        "Aevum": "",
        "Chongqing": "",
        "Sector-12": "",
        "New Tokyo": "",
        "Ishima": "",
        "Volhaven": ""
    },
    corporation: {
        division: {
            upgrades = [
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
            types = [
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

        materialWeights = {
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
    }
}