function eulerphi(n) {
let result = n;
for (let p = 2; p * p <= n; p++) {
if (n % p === 0) {
while (n % p === 0) n /= p;
result -= result / p;
}
}
if (n > 1) result -= result / n;
return result;
}

function factorize(n) {
const factors = [];
for (let p = 2; p * p <= n; p++) {
let count = 0;
while (n % p === 0) {
count++;
n /= p;
}
if (count > 0) factors.push([p, count]);
}
if (n > 1) factors.push([n, 1]);
return factors;
}

function Order(n) {
return n - eulerphi(n) - 1;
}

// --- Size ---
function divisors(n) {
const divs = [];
for (let i = 1; i <= n; i++) if (n % i === 0) divs.push(i);
return divs;
}

function alpha_n(n) {
if (n === 1) return 1;
const f = factorize(n);
let A = 1;
for (const [p, k] of f) {
A *= k % 2 === 0 ? Math.pow(p, k / 2) : Math.pow(p, (k - 1) / 2);
}
return A;
}

function Size_Zn(n) {
if (n <= 0) return "n must be positive";
const A = alpha_n(n);
const divs = divisors(n);
let S = 0;
for (const d of divs) S += d * eulerphi(n / d);
const E = (S - A - 2 * n + 2) / 2;
return E;
}

// --- Clique Number ---
function clique_number_Zn(n) {
const f = factorize(n);
const s = f.length;
let all_one = f.every(([_, a]) => a === 1);
if (all_one) return s;

let all_even_a = true;
let a = f[0][1] / 2;
for (const [_, alpha] of f) {
if (alpha % 2 !== 0 || alpha !== 2 * a) all_even_a = false;
}
if (all_even_a && a > 1) {
let prod = f.reduce((acc, [p, alpha]) => acc * Math.pow(p, alpha / 2), 1);
return prod - 1;
}

let prod_even = 1,
prod_odd = 1,
t = 0;
for (const [p, alpha] of f) {
if (alpha % 2 === 0) prod_even *= Math.pow(p, alpha / 2);
else {
prod_odd *= Math.pow(p, (alpha - 1) / 2);
t++;
}
}
return prod_even * prod_odd - 1 + t;
}

// --- Chromatic Number ---
function chromatic_number_Zn(n) {
const f = factorize(n);
let result = 1,
s = 0;
for (const [p, e] of f) {
if (e % 2 === 0) result *= Math.pow(p, e / 2);
else {
result *= Math.pow(p, (e - 1) / 2);
s++;
}
}
return result - 1 + s;
}

// --- Diameter ---
function diam_Zn(n) {
if (n < 2) return "n must be >= 2";
const f = factorize(n);
const len = f.length;
if (n === 4) return 0;
if (len >= 2) {
for (let i = 0; i < len; i++) {
for (let j = i + 1; j < len; j++) {
const p = f[i][0],
q = f[j][0],
r = n / (p * q);
if (r >= 2) return 3;
}
}
return 2;
}
if (len === 1) {
const e = f[0][1];
if (e === 2) return 1;
if (e >= 3) return 2;
}
}

// --- Girth ---
function girth(n) {
const isPrime = (num) => {
if (num < 2) return false;
for (let i = 2; i * i <= num; i++) if (num % i === 0) return false;
return true;
};

if ([4, 8, 9].includes(n)) return "∞";
if (n % 2 === 0 && n / 2 >= 3 && isPrime(n / 2)) return "∞";
if (n % 4 === 0 && n / 4 >= 3 && isPrime(n / 4)) return 4;
const f = factorize(n);
if (f.length === 2 && f[0][1] === 1 && f[1][1] === 1 && f[0][0] >= 3 && f[1][0] >= 3)
return 4;
return 3;
}

// --- Main Calculation Handler ---
function calculate(type) {
const n = parseInt(document.getElementById("inputN").value);
if (!n || n <= 0) {
document.getElementById("result").innerText = "Please enter a valid n";
return;
}

let result;
switch (type) {
case "order":
result = Order(n);
break;
case "size":
result = Size_Zn(n);
break;
case "clique":
result = clique_number_Zn(n);
break;
case "chromatic":
result = chromatic_number_Zn(n);
break;
case "diameter":
result = diam_Zn(n);
break;
case "girth":
result = girth(n);
break;
}

document.getElementById("result").innerText = `${type.toUpperCase()}: ${result}`;
}
