const rollD2 = () => { return Math.floor(Math.random() * 2) }

export const sumDiceRoll = (diceRoll) => { return diceRoll.reduce((a, b) => a + b, 0) }

export const rollDice = () => { return [rollD2(),rollD2(),rollD2(),rollD2()] }
