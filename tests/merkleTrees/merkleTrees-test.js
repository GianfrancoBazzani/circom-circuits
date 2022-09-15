const { expect } = require("chai");
const wasm_tester = require("circom_tester").wasm;

describe("----------------------merkleTre.circom TEST----------------------", function () {
    let merkleTree;

    it("Should calculate correctly the Merkle root from leaves list, test with depth = 3", async function(){
        console.log("*** template CheckRoot(n=3) ***");
        //Compute the root with test circuit, manual connected all signals of the hashes for depth = 3 merkle tree 
        const circuit1 = await wasm_tester("tests/merkleTrees/MerkleTreeDepth3OnlyTest.circom");
        const INPUT1 = {
            "leaves": [1,2,3,4,5,6,7,8]
        }
        const proof1 = await circuit1.calculateWitness(INPUT1, true); 
        console.log("   Manually connected depth 3 only Merkle tree circuit ");
        console.log("   input leaves = ", INPUT1.leaves.toString(),"\n","  root =", proof1[1]); //root result = 12926426738483865258950692701584522114385179899773452321739143007058691921961n

        //Compute merkle root using geneal merkle tree circuit with n=3 
        const circuit2 = await wasm_tester("tests/merkleTrees/MerkleTreeTestN3.circom");
        const INPUT2 = {
            "leaves": [1,2,3,4,5,6,7,8]
        }

        const proof2 = await circuit2.calculateWitness(INPUT2, true); 
        console.log("   General depth Merkle Tree circuit, set depth to 3");
        console.log("   input leaves = ", INPUT2.leaves.toString(),"\n","  root =", proof2[1]);

        expect(proof1[1]).to.equal(proof2[1]);
        
    });

    it("Should calculate correctly the merkle root from leaves list, test with depth = 4", async function(){
        console.log("*** template CheckRoot(n=4) ***");
        //Compute the root with test circuit, manual connected all signals of the hashes for depth = 4 merkle tree 
        const circuit1 = await wasm_tester("tests/merkleTrees/MerkleTreeDepth4OnlyTest.circom");
        const INPUT1 = {
            "leaves": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
        }
        const proof1 = await circuit1.calculateWitness(INPUT1, true); 
        console.log("   Manually connected depth 4 only merkle tree circuit");
        console.log("   input leaves = ", INPUT1.leaves.toString(),"\n","  root =", proof1[1]); //root result = 12849909573197439023386719626541092579807164430016488237755007164956786115756n

        //Compute merkle root using geneal merkle tree circuit with n=4
        const circuit2 = await wasm_tester("tests/merkleTrees/MerkleTreeTestN4.circom");
        const INPUT2 = {
            "leaves": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
        }

        const proof2 = await circuit2.calculateWitness(INPUT2, true); 
        console.log("   General depth Merkle Tree circuit, set depth to 4");
        console.log("   input leaves = ", INPUT2.leaves.toString(),"\n","  root =", proof2[1]);

        expect(proof1[1]).to.equal(proof2[1]);
    });

    it("Should recovery correctly the root from a merkle path",async function(){
        console.log("*** template MerkleTreeInclusionProof(n=3) ***");
        const circuit1 = await wasm_tester("tests/merkleTrees/MerkleTreeProofGenerator.circom");
        const INPUT1 = {
            "leaves": [1,2,3,4,5,6,7,8]
        }
        const proof1 = await circuit1.calculateWitness(INPUT1, true);
        console.log("   input leaves = ", INPUT1.leaves.toString(),"\n","  root =", proof1[1]); //root result = 12926426738483865258950692701584522114385179899773452321739143007058691921961n
        console.log("   Merkle proof:")
        console.log(proof1.slice(2,5));
        var pathIndex = [0,1,1];
        console.log("   path index = ", pathIndex);

        console.log("   Recovering the root");
        const circuit2 = await wasm_tester("tests/merkleTrees/MerkleTreeRootRecoveryTest.circom");
        const INPUT2 = {
            "leaf": 7,
            "path_elements" : proof1.slice(2,5),
            "path_index"    : pathIndex
        }
        const proof2 = await circuit2.calculateWitness(INPUT2, true);
        console.log("   recovered root =", proof2[1] );

        expect(proof1[1]).to.equal(proof2[1]);

    });  
    
});

describe("----------------------merkleTreeLeavesAlreadyHashed.circom TEST----------------------", function () {
    it("Should calculate correctly the Merkle root from leaves list, test with depth = 3", async function(){
        console.log("*** template CheckRoot(n=3) ***");
        //Compute the root with test circuit, manual connected all signals of the hashes for depth = 3 merkle tree 
        const circuit1 = await wasm_tester("tests/merkleTrees/MerkleTreeInAlreadyHashedDepth3OnlyTest.circom");
        const INPUT1 = {
            "inHash": [1,2,3,4,5,6,7,8]
        }
        const proof1 = await circuit1.calculateWitness(INPUT1, true); 
        console.log("   Manually connected depth 3 only Merkle tree circuit ");
        console.log("   input Hashes = ", INPUT1.inHash.toString(),"\n","  root =", proof1[1]); //root result = 14629452129687363793084585378194807561782241384488665279773588974567494940279n

        //Compute merkle root using geneal merkle tree circuit with n=3 
        const circuit2 = await wasm_tester("tests/merkleTrees/MerkleTreeInAlreadyHashedTestN3.circom");
        const INPUT2 = {
            "inHash": [1,2,3,4,5,6,7,8]
        }

        const proof2 = await circuit2.calculateWitness(INPUT2, true); 
        console.log("   General depth Merkle Tree circuit, set depth to 3");
        console.log("   input Hashes = ", INPUT2.inHash.toString(),"\n","  root =", proof2[1]);

        expect(proof1[1]).to.equal(proof2[1]);
        
    });

    it("Should calculate correctly the Merkle root from leaves list, test with depth = 4", async function(){
        console.log("*** template CheckRoot(n=4) ***");
        //Compute the root with test circuit, manual connected all signals of the hashes for depth = 4 merkle tree 
        const circuit1 = await wasm_tester("tests/merkleTrees/MerkleTreeInAlreadyHashedDepth4OnlyTest.circom");
        const INPUT1 = {
            "inHash": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
        }
        const proof1 = await circuit1.calculateWitness(INPUT1, true); 
        console.log("   Manually connected depth 4 only Merkle tree circuit ");
        console.log("   input Hashes = ", INPUT1.inHash.toString(),"\n","  root =", proof1[1]); //root result = 21013571166917622537724770309050693131274168214955073041334585836894534334888n


        //Compute merkle root using geneal merkle tree circuit with n=4
        const circuit2 = await wasm_tester("tests/merkleTrees/MerkleTreeInArleadyHashedTestN4.circom");
        const INPUT2 = {
            "inHash": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
        }

        const proof2 = await circuit2.calculateWitness(INPUT2, true); 
        console.log("   General depth Merkle Tree circuit, set depth to 4");
        console.log("   input Hashes = ", INPUT2.inHash.toString(),"\n","  root =", proof2[1]);

        expect(proof1[1]).to.equal(proof2[1]);
        
    });
    
    it("Should recovery correctly the root from a merkle path",async function(){
        console.log("*** template MerkleTreeInclusionProof(n=4) ***");
        const circuit1 = await wasm_tester("tests/merkleTrees/MerkleTreeProofGeneratorInAlreadyHashed.circom");
        const INPUT1 = {
            "inHashes": [1,2,3,4,5,6,7,8]
        }
        const proof1 = await circuit1.calculateWitness(INPUT1, true);
        console.log("   input Hashes = ", INPUT1.inHashes.toString(),"\n","  root =", proof1[1]); //root result = 14629452129687363793084585378194807561782241384488665279773588974567494940279n
        console.log("   Merkle proof:")
        console.log(proof1.slice(2,5));
        var pathIndex = [0,1,1];
        console.log("   path index = ", pathIndex);

        console.log("   Recovering the root");
        const circuit2 = await wasm_tester("tests/merkleTrees/MerkleTreeRootRecoveryInAlreadyHashedTest.circom");
        const INPUT2 = {
            "leafHash": 7,
            "path_elements" : proof1.slice(2,5),
            "path_index"    : pathIndex
        }
        const proof2 = await circuit2.calculateWitness(INPUT2, true);
        console.log("   recovered root =", proof2[1] );

        expect(proof1[1]).to.equal(proof2[1]);

    });
});