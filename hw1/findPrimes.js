#!/usr/bin/env node

// findPrimes - finds the first k primes
// Bart MacNeil

function isPrime (n)

// from http://stackoverflow.com/questions/11966520/how-to-find-prime-numbers
//
// Credit: David S
// http://stackoverflow.com/users/414414/davids
// 

{
    if (n < 2) return false;

    /**
     * An integer is prime if it is not divisible by any prime less than or equal to its square root
     **/

    var q = parseInt(Math.sqrt (n), 10);
    for (var i = 2; i <= q; i++)
    {
        if (n % i == 0)
        {
            return false;
        }
    }

    return true;
}

var firstKprime = function(k) {
	var i=1;
	var arr = [];
	for (i = 1; arr.length < k; i++) {
		if (isPrime(i)){
			arr.push(i);
			console.log("index: " + arr.length + " --> " + i);
		}
	}
	return arr;
};

// Print to Console

var fmt = function(arr) {
	return arr.join(", ");
};

var k = 100;
var fs = require('fs');
var outfile = "primes.txt";
var out = fmt(firstKprime(k)) + "\n";
fs.writeFileSync(outfile, out);

console.log("firstKprimes(" + k + ")");
console.log(out);


