const { expect} = require("chai");
const buildPoseidon = require("circomlibjs").buildPoseidon;

const wasm_tester = require("circom_tester").wasm;



describe("Mastermind general circuit with 6 colors and 4 holes", function () {
    let poseidon;

    beforeEach(async function () {
        poseidon = await buildPoseidon();
        F = poseidon.F;
    });

    it("should output 4 black pegs whit guess == solution", async function(){
        //circuit inputs
        const solution = [1,2,3,4];
        const salt = 123456789101112;
        const guess = [1,2,3,4];
        const hash = F.toObject(poseidon([...solution, salt]));

        console.log("   secret solution =", solution);
        console.log("   secret salt =", salt);
        console.log("   public guess =", guess);
        console.log("   public salted hash =", hash);

        const circuit = await wasm_tester("tests/mastermind/mastermindTest.circom");
        const INPUT = {
            "solution": solution,
            "solutionSalt": salt,
            "guess": guess,
            "pubSolutionHash": hash
        }
        const proof = await circuit.calculateWitness(INPUT, true); 
    
        console.log("   white pegs = ", proof[1]);
        console.log("   black pegs = ", proof[2]);

        expect(proof[2]).to.equal(BigInt("4"));
    });

    it("should output 4 white pegs whit if solution contains messed guess", async function(){
        //circuit inputs
        const solution = [1,2,3,4];
        const salt = 123456789101112;
        const guess = [2,1,4,3];
        const hash = F.toObject(poseidon([...solution, salt]));

        console.log("   secret solution =", solution);
        console.log("   secret salt =", salt);
        console.log("   public guess =", guess);
        console.log("   public salted hash =", hash);

        const circuit = await wasm_tester("tests/mastermind/mastermindTest.circom");
        const INPUT = {
            "solution": solution,
            "solutionSalt": salt,
            "guess": guess,
            "pubSolutionHash": hash
        }
        const proof = await circuit.calculateWitness(INPUT, true); 
    
        console.log("   white pegs = ", proof[1]);
        console.log("   black pegs = ", proof[2]);

        expect(proof[1]).to.equal(BigInt("4"));
    });

    it("random combination", async function(){
        //circuit inputs
        const solution = [3,1,6,2];
        const salt = 123456789101112;
        const guess = [1,5,4,2];
        const hash = F.toObject(poseidon([...solution, salt]));

        console.log("   secret solution =", solution);
        console.log("   secret salt =", salt);
        console.log("   public guess =", guess);
        console.log("   public salted hash =", hash);

        const circuit = await wasm_tester("tests/mastermind/mastermindTest.circom");
        const INPUT = {
            "solution": solution,
            "solutionSalt": salt,
            "guess": guess,
            "pubSolutionHash": hash
        }
        const proof = await circuit.calculateWitness(INPUT, true); 
    
        console.log("   white pegs = ", proof[1]);
        console.log("   black pegs = ", proof[2]);

        expect(proof[0]).to.equal(BigInt("1"));
        expect(proof[1]).to.equal(BigInt("1"));
    });

    it("should throw error if the salted hash is wrong, line 97 (hash.out === pubSolutionHash;)", async function(){
        //circuit inputs
        const solution = [3,1,6,2];
        const salt = 123456789101112;
        const guess = [1,5,4,2];
        const hash = 0;

        console.log("   secret solution =", solution);
        console.log("   secret salt =", salt);
        console.log("   public guess =", guess);
        console.log("   public salted hash =", hash);

        const circuit = await wasm_tester("tests/mastermind/mastermindTest.circom");
        const INPUT = {
            "solution": solution,
            "solutionSalt": salt,
            "guess": guess,
            "pubSolutionHash": hash
        }
        
        try{
            await circuit.calculateWitness(INPUT, true);
            throw "WrongError";
        }catch(err){
            if(err != "WrongError"){
                if(err.message.includes("Error: Assert Failed. Error in template MasterMind_80 line: 97")){
                    console.log("   ",err.message);
                } else{
                    throw "Circuit not throwing correct error"
                }
            }else {
                throw "Circuit not throwing error"
            }
        }

    });
    it("should throw error with solution values out of range, line 50 (solLessEqThan[i].out === 1;)", async function(){
        //circuit inputs
        const solution = [3,1,7,2];
        const salt = 123456789101112;
        const guess = [1,5,4,2];
        const hash = F.toObject(poseidon([...solution, salt]));

        console.log("   secret solution =", solution);
        console.log("   secret salt =", salt);
        console.log("   public guess =", guess);
        console.log("   public salted hash =", hash);

        const circuit = await wasm_tester("tests/mastermind/mastermindTest.circom");
        const INPUT = {
            "solution": solution,
            "solutionSalt": salt,
            "guess": guess,
            "pubSolutionHash": hash
        }
        
        try{
            await circuit.calculateWitness(INPUT, true);
            throw "WrongError";
        }catch(err){
            if(err != "WrongError"){
                if(err.message.includes("Error: Assert Failed. Error in template MasterMind_80 line: 50")){
                    console.log("   ",err.message);
                } else{
                    throw "Circuit not throwing correct error"
                }
            }else {
                throw "Circuit not throwing error"
            }
        }


    });

    it("should throw error with guess values out of range, line 78 (gueLessEqThan[i].out === 1;)", async function(){
        //circuit inputs
        const solution = [3,1,6,2];
        const salt = 123456789101112;
        const guess = [1,6,7,2];
        const hash = F.toObject(poseidon([...solution, salt]));

        console.log("   secret solution =", solution);
        console.log("   secret salt =", salt);
        console.log("   public guess =", guess);
        console.log("   public salted hash =", hash);

        const circuit = await wasm_tester("tests/mastermind/mastermindTest.circom");
        const INPUT = {
            "solution": solution,
            "solutionSalt": salt,
            "guess": guess,
            "pubSolutionHash": hash
        }
        
        try{
            await circuit.calculateWitness(INPUT, true);
            throw "WrongError";
        }catch(err){
            if(err != "WrongError"){
                if(err.message.includes("Error: Assert Failed. Error in template MasterMind_80 line: 78")){
                    console.log("   ",err.message);
                } else{
                    throw "Circuit not throwing correct error"
                }
            }else {
                throw "Circuit not throwing error"
            }
        }

    });

    it("should throw error with repeated value in solution, line 58 (solIsEqual[i*h+j].out === 0;)", async function(){
        //circuit inputs
        const solution = [3,1,6,6];
        const salt = 123456789101112;
        const guess = [1,3,4,2];
        const hash = F.toObject(poseidon([...solution, salt]));

        console.log("   secret solution =", solution);
        console.log("   secret salt =", salt);
        console.log("   public guess =", guess);
        console.log("   public salted hash =", hash);

        const circuit = await wasm_tester("tests/mastermind/mastermindTest.circom");
        const INPUT = {
            "solution": solution,
            "solutionSalt": salt,
            "guess": guess,
            "pubSolutionHash": hash
        }
        
        try{
            await circuit.calculateWitness(INPUT, true);
            throw "WrongError";
        }catch(err){
            if(err != "WrongError"){
                if(err.message.includes("Error: Assert Failed. Error in template MasterMind_80 line: 58")){
                    console.log("   ",err.message);
                } else{
                    throw "Circuit not throwing correct error"
                }
            }else {
                throw "Circuit not throwing error"
            }
        }

    });

    it("should throw error with repeated value in guess, line 86 (gueIsEqual[i*h+j].out === 0;)", async function(){
        const solution = [1,2,3,4];
        const salt = 123456789101112;
        const guess = [1,2,4,4];
        const hash = F.toObject(poseidon([...solution, salt]));

        console.log("   secret solution =", solution);
        console.log("   secret salt =", salt);
        console.log("   public guess =", guess);
        console.log("   public salted hash =", hash);

        const circuit = await wasm_tester("tests/mastermind/mastermindTest.circom");
        const INPUT = {
            "solution": solution,
            "solutionSalt": salt,
            "guess": guess,
            "pubSolutionHash": hash
        }
        
        try{
            await circuit.calculateWitness(INPUT, true);
            throw "WrongError";
        }catch(err){
            if(err != "WrongError"){
                if(err.message.includes("Error: Assert Failed. Error in template MasterMind_80 line: 86")){
                    console.log("   ",err.message);
                } else{
                    throw "Circuit not throwing correct error"
                }
            }else {
                throw "Circuit not throwing error"
            }
        }
    });
});