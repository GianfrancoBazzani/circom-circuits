pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

// include "https://github.com/0xPARC/circom-secp256k1/blob/master/circuits/bigint.circom";

// Configurable Mastermind
// c = Number of colors, min 5 max 10
// h = Number of holes, min 3  max 6
// c always has to be bigger than h

// Game Steps:
// 1-Code maker should create a solution, hash de solution with a salt and make public the hash digest.
// 2-Code breaker should try to solve introducing a guess and the public Hash of solution.
// 3-The circuit has to be computed with the signals needed from both parts. 
// 3-Repeat from step 2 until the circuit outputs 4 black pegs (code breakers wins) or max iterations reached(code maker wins).

// Black and white pegs are automaticaly outputed by the circuit.

template MasterMind (c,h) {
    // Code maker signals 
    signal input solution[h];
    signal input solutionSalt;
        
    // Code breaker signals
    signal input guess[h];
    signal input pubSolutionHash;

    // Outputs
    signal output whitePegs;
    signal output blackPegs;

    // Check that the input signals are within the limits of the game and non repeated.
    // Check solution
    component solLessEqThan[h];
    component solGreaterEqThan[h];
    component solIsEqual[(h**2)];

    for(var i = 0; i<h ; i++){
        solLessEqThan[i] = LessEqThan(4);
        solGreaterEqThan[i] = GreaterEqThan(4);
        
        solLessEqThan[i].in[0] <== solution[i];
        solLessEqThan[i].in[1] <== c;

        solGreaterEqThan[i].in[0] <== solution[i];
        solGreaterEqThan[i].in[1] <== 0;

        solLessEqThan[i].out === 1;
        solGreaterEqThan[i].out === 1;
        //Check for repeated colors
        for(var j = 0; j < h ; j++) {
            if(j != i){
                solIsEqual[i*h+j] = IsEqual();
                solIsEqual[i*h+j].in[0] <== solution[i];
                solIsEqual[i*h+j].in[1] <== solution[j];
                solIsEqual[i*h+j].out === 0;
            }
        }
    }

    // Check guess
    component gueLessEqThan[h];
    component gueGreaterEqThan[h];
    component gueIsEqual[(h**2)];

    for(var i = 0; i<h ; i++){
        gueLessEqThan[i] = LessEqThan(4);
        gueGreaterEqThan[i] = GreaterEqThan(4);
        
        gueLessEqThan[i].in[0] <== solution[i];
        gueLessEqThan[i].in[1] <== c;

        gueGreaterEqThan[i].in[0] <== solution[i];
        gueGreaterEqThan[i].in[1] <== 0;

        gueLessEqThan[i].out === 1;
        gueGreaterEqThan[i].out === 1;
        //Check for repeated colors
        for(var j = 0; j < h ; j++) {
            if(j != i){
                gueIsEqual[i*h+j] = IsEqual();
                gueIsEqual[i*h+j].in[0] <== solution[i];
                gueIsEqual[i*h+j].in[1] <== solution[j];
                gueIsEqual[i*h+j].out === 0;
            }
        }
    }

    // Check if the solution is the correct one calculating the commitment hash
    component hash = Poseidon(h+1);
    for(var i = 0 ; i<h; i++){
        hash.inputs[i] <== solution[i];
    }
    hash.inputs[h] <== solutionSalt;
    hash.out === pubSolutionHash;

    // Calculate pegs
    component pegsIsEqual[(h**2)];
    var wp = 0;
    var bp = 0;

    for(var i = 0; i<h; i++){
        for(var j = 0; j<h; j++){
            pegsIsEqual[i*h+j] = IsEqual();
            pegsIsEqual[i*h+j].in[0] <== guess[j];
            pegsIsEqual[i*h+j].in[1] <== solution[i];
            if(j != i){
                wp = wp + pegsIsEqual[i*h+j].out;  
            } else {
                bp = bp + pegsIsEqual[i*h+j].out;
            }
        }
    }

    whitePegs <== wp;
    blackPegs <== bp;
    
}
