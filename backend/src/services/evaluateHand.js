function checkCombi(table, player) {
    const tableCards = table.getCards();
    const playerCards = player.getCards();
    let cards = [...tableCards, ...playerCards];
    
    cards.sort((a, b) => a[1] - b[1]);

    function removeSame(cards) {
        let seen = new Set();
        return cards.filter(card => {
            if (!seen.has(card[1])) {
                seen.add(card[1]);
                return true;
            }
            return false;
        });
    }
    
    function checkStraight(cards) {
        let uniqueCards = removeSame(cards);
        if (uniqueCards.length < 5) return [false, null];
        
        for (let i = 0; i <= uniqueCards.length - 5; i++) {
            let setOfFive = uniqueCards.slice(i, i + 5);
            if (setOfFive.every((card, idx) => idx === 0 || card[1] - 1 === setOfFive[idx - 1][1])) {
                return [true, setOfFive[4][1]];
            }
        }
        return [false, null];
    }
    
    function checkFlush(cards) {
        let suitCounts = { 'S': 0, 'H': 0, 'D': 0, 'C': 0 };
        for (let card of cards) {
            let suit = card[0].slice(-1);
            suitCounts[suit]++;
        }
        for (let suit in suitCounts) {
            if (suitCounts[suit] >= 5) return [true, null];
        }
        return [false, null];
    }
    
    function countRepeat(cards) {
        let counts = {};
        for (let card of cards) {
            let [number, rank] = [card[0][0], card[1]];
            let key = `${number}-${rank}`;
            counts[key] = (counts[key] || 0) + 1;
        }
        
        let pairs = [], threeKind = null, fourKind = null;
        
        Object.entries(counts).forEach(([key, count]) => {
            let rank = parseInt(key.split('-')[1]);
            if (count === 2) pairs.push(rank);
            if (count === 3) threeKind = rank;
            if (count === 4) fourKind = rank;
        });
        
        pairs.sort((a, b) => b - a);
        
        if (fourKind) return [8, fourKind];
        if (threeKind && pairs.length > 0) return [7, [threeKind, pairs[0]]];
        if (threeKind) return [4, threeKind];
        if (pairs.length >= 2) return [3, pairs.slice(0, 2)];
        if (pairs.length === 1) return [2, pairs[0]];
        return [1, cards[cards.length - 1][1]];
    }
    
    let straightResult = checkStraight(cards);
    let flushResult = checkFlush(cards);
    
    if (straightResult[0] && flushResult[0]) {
        return cards[cards.length - 1][1] === 13 ? [10, null] : [9, straightResult[1]];
    }
    if (flushResult[0]) return [6, null];
    if (straightResult[0]) return [5, straightResult[1]];
    
    return countRepeat(cards);
}
