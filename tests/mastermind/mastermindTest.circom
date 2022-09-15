pragma circom 2.0.0;

// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit

include "../../mastermind/mastermind.circom";


template MasterMind64() {

    var holes = 4;
    var colors = 6;

    // Code maker signals 
    signal input solution[holes];
    signal input solutionSalt;
        
    // Code breaker signals
    signal input guess[holes];
    signal input pubSolutionHash;

    // Outputs
    signal output whitePegs;
    signal output blackPegs;

    component game = MasterMind (colors,holes);

    for(var i = 0; i < holes ; i++){
        game.solution[i] <== solution[i];
        game.guess[i] <== guess[i];
    }

    game.solutionSalt <== solutionSalt;
    game.pubSolutionHash <== pubSolutionHash;

    whitePegs <== game.whitePegs;
    blackPegs <== game.blackPegs;

}

component main = MasterMind64();