import {
    sliceIntoChunks,
    uniqify
} from 'util/helpers.js'
/** @param {import("NetscriptDefinitions").NS } ns */
export async function main(ns) {
    // ns.clear("/solve-log.txt")
    let contracts = ns.ls("home", "contract-").filter(x => x != "-log").map(contract => {
        let splits = ns.read(contract).split("?!\n")
        let name = contract.split("contracts/")[1].replace(".txt", ".cct")
        let target = splits[0]
        return {
            filename: contract,
            name,
            target,
            type: splits[1],
            description: splits[2],
            data: ns.codingcontract.getData(name, target),
        }
    })


    await ns.write("solve-log.txt", `types ${contracts.map(x => x.type).join(",")}\n`)
    for (let contract of contracts) {
        switch (contract.type) {
            case "Spiralize Matrix":
                await solveSpiralizeMatrix(ns, contract)
                break;

            case "Find All Valid Math Expressions":
                await solveFindAllValidMathExpressions(ns, contract)
                break;

            case "Unique Paths in a Grid I":
                await solveUniquePathsInAGridI(ns, contract)
                break;

            case "Unique Paths in a Grid II":
                await solveUniquePathsInAGridII(ns, contract)
                break;

            case "Subarray with Maximum Sum":
                await solveSubarrayWithMaximumSum(ns, contract)
                break;

            case "Total Ways to Sum":
                await solveTotalWaysToSum(ns, contract)
                break;

            case "Algorithmic Stock Trader I":
                await solveAlgorithmicStockTraderI(ns, contract)
                break;
            case "Algorithmic Stock Trader II":
                await solveAlgorithmicStockTraderII(ns, contract)
                break;
            case "Algorithmic Stock Trader III":
                await solveAlgorithmicStockTraderIII(ns, contract)
                break;
            case "Algorithmic Stock Trader IV":
                await solveAlgorithmicStockTraderIV(ns, contract)
                break;

            case "Merge Overlapping Intervals":
                await solveMergeOverlappingIntervals(ns, contract)
                break;

            case "Generate IP Addresses":
                await solveGenerateIPAddresses(ns, contract)
                break;

            case "Find Largest Prime Factor":
                await solveFindLargestPrimeFactor(ns, contract)
                break;

            case "Array Jumping Game":
                await solveArrayJumpingGame(ns, contract)
                break;

            case "Minimum Path Sum in a Triangle":
                await solveMinimumPathSumInATriangle(ns, contract)
                break;
            case "Sanitize Parentheses in Expression":
                await solveSanitizeParenthesesInExpression(ns, contract)
                break;

            default:
                await ns.write("solve-log.txt", `Please support puzzle ${contract.type}\n`)
        }
        await ns.sleep(1000)
    }
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveSanitizeParenthesesInExpression(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let inputs = contract.data.split("")
    let answer = []
    for (let index in inputs) {
        answer = answer.concat(removeInvalidExpressions(inputs, parseInt(index)))

    }
    if (!answer.length) {
        answer = [""]
    } else {
        let min = 99
        answer = answer.reduce((acc, x) => {
            if (x.removals < min) {
                min = x.removals
                acc = [x.inputs.join("")]
            } else if (x.removals == min) {
                acc.push(x.inputs.join(""))
            }
            return acc
        }, [])
    }
    answer = uniqify(answer)

    // await ns.write("solve-log.txt", "[" +answer.join("],[") +"]" + "\n")
    await solve(ns, answer, contract)
}

function uniqifyToLowest(inputs) {
    let min = 99
    inputs = inputs.reduce((acc, x) => {
        if (x.removals < min) {
            min = x.removals
            acc = [x.inputs]
        } else if (x.removals == min) {
            acc.push(x.inputs)
        }
        return acc
    }, [])
    return uniqify(inputs).map(x => ({
        removals: min,
        inputs: x
    }))
}

// this returns true
//(()(ss((( )())S)))
function expressionIsValid(inputs) {
    let groupings = 0
    let hasLength = false
    let string = [...inputs]
    while (string.length > 0) {
        hasLength = true
        let input = string.shift()

        if (input == "(") {
            groupings++
        } else if (input == ")") {
            if (groupings > 0) {
                groupings--
            } else {
                return false
            }
        }
    }

    return !groupings && hasLength
}

function removeInvalidExpressions(inputs, index, removals = 0, sum = []) {
    if (expressionIsValid(inputs)) {
        sum.push({
            inputs,
            removals
        })
    }

    if (index <= inputs.length - 1) {
        let inputRemove = [...inputs]
        if (inputRemove[index] != "a") {
            inputRemove.splice(index, 1);
            sum = sum.concat(removeInvalidExpressions(inputRemove, index, removals + 1, sum))
            sum = uniqifyToLowest(sum)
        }
    }

    if (index >= inputs.length - 1) {
        return sum
    }

    sum = sum.concat(removeInvalidExpressions(inputs, index + 1, removals, sum))
    sum = uniqifyToLowest(sum)

    return sum
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveMinimumPathSumInATriangle(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let inputs = contract.data
    let answer = doNextPyramidJump(inputs)
    // await ns.write("solve-log.txt", answer + "\n")
    // this is wrong? i think its right tho
    await solve(ns, answer, contract)
}

function doNextPyramidJump(array) {

    let memo = [];
    let n = array.length - 1;

    // For the bottom row
    for (let i = 0; i < array[n].length; i++)
        memo[i] = array[n][i];

    // Calculation of the
    // remaining rows, in
    // bottom up manner.
    for (let i = array.length - 2; i >= 0; i--)
        for (let j = 0; j < array[i].length; j++)
            memo[j] = array[i][j] +
            Math.min(memo[j],
                memo[j + 1]);

    // Return the
    // top element
    return memo[0];
}


/** @param {import("NetscriptDefinitions").NS } ns */
async function solveSpiralizeMatrix(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let grid = contract.data
    let i = 0
    let max = Math.floor((grid[0].length) / 2)
    let answer = ''
    if (max >= 1) {
        while (i <= max) {
            // let top = grid[i].slice(i, grid[i].length - i)
            let top = grid.shift()

            // let right = grid.map(row => row[row.length - 1 - i]).slice(i + 1, grid.length - i - 1).join(",")
            let right = grid.map(row => row.pop()).join(",")

            // let bottom = grid[grid.length - 1 - i].slice(i, grid[i].length - i).reverse().join(",")
            let bottom = grid.pop()
            bottom = bottom ? bottom.reverse() : bottom

            // let left = grid.map(row => row[i]).slice(i + 1, grid.length - i - 1).reverse().join(",")
            let left = grid.map(row => row.shift()).reverse().join(",")
            if (top || right || bottom || left) {
                answer += ',' + [top, right, bottom, left].filter(x => x).filter(x => x.length).join(",")
            }
            i++
        }
    } else {
        while (grid.length) {
            let temp = grid.shift()
            if (temp) {
                answer += ',' + temp
            }
        }
    }

    answer = answer.replace(",", "")
    answer = answer.split(',')

    // await ns.write("solve-log.txt", answer + "\n")
    await solve(ns, answer, contract)
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveFindAllValidMathExpressions(ns, contract) {
    let i, j;

    let operatorList = ["", "+", "-", "*"];
    let validExpressions = [];
    let arrayData = contract.data
    let tempPermutations = Math.pow(4, (arrayData[0].length - 1));

    for (i = 0; i < tempPermutations; i++) {
        let arraySummands = [];
        let candidateExpression = arrayData[0].substr(0, 1);
        arraySummands[0] = parseInt(arrayData[0].substr(0, 1));

        for (j = 1; j < arrayData[0].length; j++) {
            candidateExpression += operatorList[(i >> ((j - 1) * 2)) % 4] + arrayData[0].substr(j, 1);

            let rollingOperator = operatorList[(i >> ((j - 1) * 2)) % 4];
            let rollingOperand = parseInt(arrayData[0].substr(j, 1));

            switch (rollingOperator) {
                case "":
                    rollingOperand = rollingOperand * (arraySummands[arraySummands.length - 1] / Math.abs(arraySummands[arraySummands.length - 1]));
                    arraySummands[arraySummands.length - 1] = arraySummands[arraySummands.length - 1] * 10 + rollingOperand;
                    break;
                case "+":
                    arraySummands[arraySummands.length] = rollingOperand;
                    break;
                case "-":
                    arraySummands[arraySummands.length] = 0 - rollingOperand;
                    break;
                case "*":
                    while (j < arrayData[0].length - 1 && ((i >> (j * 2)) % 4) === 0) {
                        j += 1;
                        candidateExpression += arrayData[0].substr(j, 1);
                        rollingOperand = rollingOperand * 10 + parseInt(arrayData[0].substr(j, 1));
                    }
                    arraySummands[arraySummands.length - 1] = arraySummands[arraySummands.length - 1] * rollingOperand;
                    break;
            }
        }

        let rollingTotal = arraySummands.reduce(function (a, b) {
            return a + b;
        });

        //if(arrayData[1] == eval(candidateExpression)){
        if (arrayData[1] === rollingTotal) {
            validExpressions[validExpressions.length] = candidateExpression;
        }
    }
    await solve(ns, validExpressions, contract)

}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveUniquePathsInAGridI(ns, contract) {
    // await ns.write("solve-log.txt",contract.description + "\n")
    let y = contract.data[0]
    let x = contract.data[1]

    y = Array.from({
        length: y
    }, (_x, i) => i);
    let grid = y.map(_ => {
        return Array.from({
            length: x
        }, (_x, i) => i);
    })
    let answer = addUniquePaths(grid)
    // await ns.write("solve-log.txt", `paths: ${answer} \n`)
    await solve(ns, answer, contract)
}

function addUniquePaths(grid, x = 0, y = 0) {
    let paths = 0
    if (grid[y][x + 1]) {
        paths += addUniquePaths(grid, x + 1, y)
    }

    if (grid[y + 1]) {
        paths += addUniquePaths(grid, x, y + 1)
    }

    if (x == (grid[0].length - 1) && y == (grid.length - 1)) {
        return 1
    }

    return paths
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveUniquePathsInAGridII(ns, contract) {
    // await ns.write("solve-log.txt",contract.description + "\n")
    let grid = contract.data
    let answer = addUniquePathsWithBlocks(grid)
    // await ns.write("solve-log.txt", `paths: ${answer} \n`)
    await solve(ns, answer, contract)
}

function addUniquePathsWithBlocks(grid, x = 0, y = 0) {
    let paths = 0
    if (grid[y][x + 1] == 0) {
        paths += addUniquePathsWithBlocks(grid, x + 1, y)
    }

    if (grid[y + 1] && grid[y + 1][x] == 0) {
        paths += addUniquePathsWithBlocks(grid, x, y + 1)
    }

    if (x == (grid[0].length - 1) && y == (grid.length - 1)) {
        return 1
    }

    return paths
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveSubarrayWithMaximumSum(ns, contract) {
    let inputs = contract.data
    let answer = -999999999
    for (const index in inputs) {
        let i = index
        let sum = 0
        while (i < inputs.length) {
            sum += inputs[i]
            if (sum > answer) {
                answer = sum
            }
            i++
        }
    }
    await solve(ns, answer, contract)
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveTotalWaysToSum(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let answer = countCombinations(contract.data, 1) - 1
    await solve(ns, answer, contract)
}

function countCombinations(number, minimal) {
    let temp = 1
    if (number <= 1) {
        return 1
    }
    for (let i = 1; i <= Math.floor(number / 2); i++) {
        if (i >= minimal) {
            temp += countCombinations(number - i, i)
        }
    }

    return temp
}

function doTrade(stockPrices, maxTrades) {
    let i, j, k;

    // WHY?
    let tempStr = "[0";
    for (i = 0; i < stockPrices.length; i++) {
        tempStr += ",0";
    }
    tempStr += "]";
    let tempArr = "[" + tempStr;
    for (i = 0; i < maxTrades - 1; i++) {
        tempArr += "," + tempStr;
    }
    tempArr += "]";

    let highestProfit = JSON.parse(tempArr);

    for (i = 0; i < maxTrades; i++) {
        for (j = 0; j < stockPrices.length; j++) { // Buy / Start
            for (k = j; k < stockPrices.length; k++) { // Sell / End
                if (i > 0 && j > 0 && k > 0) {
                    highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
                } else if (i > 0 && j > 0) {
                    highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
                } else if (i > 0 && k > 0) {
                    highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
                } else if (j > 0 && k > 0) {
                    highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
                } else {
                    highestProfit[i][k] = Math.max(highestProfit[i][k], stockPrices[k] - stockPrices[j]);
                }
            }
        }
    }
    return highestProfit[maxTrades - 1][stockPrices.length - 1];
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveAlgorithmicStockTraderI(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let prices = contract.data
    let highestProfit = doTrade(prices, 1)
    // await ns.write("solve-log.txt", highestProfit + "\n")
    await solve(ns, highestProfit, contract)
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveAlgorithmicStockTraderII(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let prices = contract.data
    let highestProfit = doTrade(prices, Math.ceil(prices.length / 2))
    // await ns.write("solve-log.txt", highestProfit + "\n")
    await solve(ns, highestProfit, contract)

}


/** @param {import("NetscriptDefinitions").NS } ns */
async function solveAlgorithmicStockTraderIII(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let prices = contract.data
    let highestProfit = doTrade(prices, 2)
    // await ns.write("solve-log.txt", highestProfit + "\n")
    await solve(ns, highestProfit, contract)
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveAlgorithmicStockTraderIV(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let prices = contract.data[1]
    let trades = contract.data[0]
    let highestProfit = doTrade(prices, trades)
    // await ns.write("solve-log.txt", highestProfit + "\n")
    await solve(ns, highestProfit, contract)
}



/** @param {import("NetscriptDefinitions").NS } ns */
async function solveMergeOverlappingIntervals(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let inputs = contract.data
    // await ns.write("solve-log.txt", `inputs: [[${inputs.map(x => x.join(",")).join("],[")}]]\n`)

    let tempOverlap = []
    let i = 0
    while (inputs.length != tempOverlap.length && (i < 15)) {
        tempOverlap = inputs
        let newInputs = []
        for (let [b1, b2] of inputs) {
            // input: 8 13
            // 10,17
            //8,10
            //2,9
            // newInputs: [[19,28],[10,17]]
            let foundSomething = false

            newInputs = newInputs.map(([a1, a2]) => {
                // 1 7va
                // 3 9
                // == 1 9
                if (!foundSomething && (b1 >= a1) && (b2 >= a2) && (b1 <= a2)) {
                    foundSomething = true
                    return [a1, b2]
                    // 3 9
                    // 1 7
                    // == 1 9
                } else if (!foundSomething && b1 <= a1 && b2 <= a2 && a1 <= b2) {
                    foundSomething = true
                    return [b1, a2]
                    // 1 9
                    // 3 7
                    // == 1 9
                } else if (!foundSomething && a1 <= b1 && a2 >= b2) {
                    foundSomething = true
                    return [a1, a2]
                    // 3 7
                    // 1 9
                    // == 1 9
                } else if (!foundSomething && b1 <= a1 && b2 >= a2) {
                    foundSomething = true
                    return [b1, b2]
                }

                return [a1, a2]
            })

            if (!foundSomething) {
                newInputs.push([b1, b2])
            }
            // await ns.write("solve-log.txt", `${foundSomething} newInputs: [[${newInputs.map(x => x.join(",")).join("],[")}]]\n`)
        }
        inputs = newInputs
        i++
    }

    let answer = sliceIntoChunks(inputs.reduce((acc, x) => acc.concat(x), []).sort((a, b) => a - b), 2)
    // await ns.write("solve-log.txt", answer)
    await solve(ns, answer, contract)
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveGenerateIPAddresses(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let length = contract.data.length
    let input = contract.data
    let ips = []

    check(0, 0, '');

    // i had to cheat for this one ;( copypasta
    function check(start, level, previous) {
        let i = 0;
        let num;

        if (level === 3) {
            num = input.substring(start);
            if (num && num < 256) {
                ips.push(`${previous}.${num}`);
            }
            return;
        }
        num = input.substring(start, start + 1);
        if (num == 0) {
            check(start + 1, level + 1, level === 0 ? `${num}` : `${previous}.${num}`);
        } else {
            while (num.length < 4 && num < 256 && start + i + 1 < length) {
                check(start + i + 1, level + 1, level === 0 ? `${num}` : `${previous}.${num}`);
                i++;
                num = input.substring(start, start + i + 1);
            }
        }
    }

    // await ns.write("solve-log.txt", ips.join('\n') + '\n')
    await solve(ns, ips, contract)
}

/** @param {import("NetscriptDefinitions").NS } ns */
async function solveArrayJumpingGame(ns, contract) {
    // await ns.write("solve-log.txt", contract.description + "\n")
    let jumps = contract.data
    let answer = doNextJump(jumps, 0, )
    // await ns.write("solve-log.txt", answer + "\n")
    await solve(ns, answer, contract)
}

function doNextJump(jumps, index, result = 0) {
    if (index == (jumps.length - 1)) {
        return 1
    }
    let jump = jumps[index]
    for (let i = 1; i <= jump; i++) {
        result = result == 0 ? doNextJump(jumps, index + i, result) : result
    }
    return result
}


/** @param {import("NetscriptDefinitions").NS } ns */
async function solveFindLargestPrimeFactor(ns, contract) {
    const factors = [];
    let divisor = 2;
    let n = contract.data
    // i  cheated for this one ;( copypasta
    while (n >= 2) {
        if (n % divisor == 0) {
            factors.push(divisor);
            n = n / divisor;
        } else {
            divisor++;
        }
    }
    let answer = factors[factors.length - 1]
    await solve(ns, answer, contract)
}


/** @param {import("NetscriptDefinitions").NS } ns */
async function solve(ns, answer, contract) {
    let reward = ns.codingcontract.attempt(answer, contract.name, contract.target, {
        returnReward: true
    })
    if (reward) {
        await ns.write("solve-log.txt", `${contract.name} reward: ${reward}\n`)
        ns.rm(contract.filename)
        return true
    } else {
        alert(`contract failure! ${contract.name} ${contract.type}, answer: ${answer}\n`)
        return false
    }
}