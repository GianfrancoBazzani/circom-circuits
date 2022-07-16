


pragma circom 2.0.0;

include "node_modules/circomlib/circuitsposeidon.circom";

template CheckRoot(n) { // compute the root of a MerkleTree of n levels
    //  Example with n = 4;
    //
    //      H(H(H(l_1),H(l_2)),H(H(l_4),H(l_5))) ---> Merkle root
    //           /                      \
    //          /                        \
    //  H(H(l_1),H(l_2))          H(H(l_4),H(l_5))
    //     /    \                     /      \
    //    /      \                   /        \
    //  H(l_1)  H(l_2)             H(l_4)    H(l_5)
    //    |       |                  |         |
    //   l_1     l_2                l_3       l_4
    //
    signal input leaves[2**n];
    signal output root;

    // components definition
    component posHash1In[2**n];
    component posHash2In[(2**n)-1];

    // components initialitzation
    for (var i = 0; i<(2**n); i++){
        posHash1In[i] = Poseidon(1);
        posHash1In[i].inputs[0] <== leaves[i]; // set leaves to one input hash inputs
    }



    for (var i = n-1; i >= 0 ; i--){
        var z = 2**(n)-1;
        for(var j = 2**(i+1)-2 ; j >= (2**i)-1 ; j--){
            posHash2In[j] = Poseidon(2);
            if(i == n-1){
                posHash2In[j].inputs[1] <== posHash1In[z].out;
                posHash2In[j].inputs[0] <== posHash1In[z-1].out;
                z=z-2;
            } else{
                posHash2In[j].inputs[1] <== posHash2In[j*2+2].out;
                posHash2In[j].inputs[0] <== posHash2In[j*2+1].out;
            }
            
        }
    }


    root <== posHash2In[0].out;
 
}
