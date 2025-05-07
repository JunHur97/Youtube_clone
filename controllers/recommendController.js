module.exports = {

};

// (a1-a2 + b1-b2 + c1-c2 + a1-b2 + b1-c2 + c1-a2 + a1-c2 + b1-a2 + c1-b2) / 9
// (3*a1 - 3*a2 + 3*b1 - 3*b2 + 3*c1 - 3*c2) / 9
// (a1+b1+c1 - (a2+b2+c2)) / 3
// (a1+b1+c1)/3 - (a2+b2+c2)/3
// >> toAvg