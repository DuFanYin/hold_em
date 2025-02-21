function checkWinner(table, players) {
    let playersCombi = [];
    let remainingPlayers = players.filter(player => player.getState() !== 'fold');
    
    for (let player of remainingPlayers) {
        playersCombi.push([player, player.getName(), checkCombi(table, player)]);
    }
    
    playersCombi.sort((a, b) => b[2][0] - a[2][0]);
    
    let topCombi = playersCombi[0][2][0];
    let playersWithTopCombi = playersCombi.filter(item => item[2][0] === topCombi);
    
    let winners = [], topTiebreaker = playersWithTopCombi[0][2][1];
    for (let player of playersWithTopCombi) {
        if (player[2][1] > topTiebreaker) {
            winners = [player[0]];
            topTiebreaker = player[2][1];
        } else if (player[2][1] === topTiebreaker) {
            winners.push(player[0]);
        }
    }
    
    const combiNames = {
        10: 'royal flush',
        9: 'straight flush',
        8: 'four of a kind',
        7: 'full house',
        6: 'flush',
        5: 'straight',
        4: 'three of a kind',
        3: 'two pair',
        2: 'one pair',
        1: 'high card'
    };
    
    let winningCombi = combiNames[topCombi] || 'Unknown';
    
    return [winners, winningCombi];}