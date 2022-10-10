# Exclusively
Exclusively is a simple class that provides methods for executing async functions exclusively.

## Features
Calls fetch() or other async functions exclusively

## Installation
```shell
npm install exclusively
```

## Usage
### fetch resources sequentially
```javascript
import { Exclusively } from "exclusively";

const request = new Request("https://example.com/");

/* JavaScript fetch() function */

                 // Network waterfall (example)
fetch(request);  // |----|
fetch(request);  // |-------|
fetch(request);  // |--|


/* Exclusively fetch() method */
const context = new Exclusively();

                         // Network waterfall (example)
context.fetch(request);  // |---|
context.fetch(request);  //     |-----|
context.fetch(request);  //           |----|
```

### call async functions sequentially
```javascript
import { Exclusively } from "exclusively";

const wait3s = async () => new Promise(resolve => setTimeout(() => {
    console.log("3s");
    resolve();
}, 3000));

/* print "3s" three times every three seconds. */
const context = new Exclusively();

                       // execution time
context.exec(wait3s);  // |---|
context.exec(wait3s);  //     |---|
context.exec(wait3s);  //         |---|
```

### share "Exclusively" instance among multiple script files
#### sample1.js
```javascript
import { Exclusively } from "exclusively";

const context = Exclusively.getContext("sample");  // get context named "sample" (if it does not exist, it will be created)

context.fetch("https://example.com/");
```
#### sample2.js
```javascript
import { Exclusively } from "exclusively";

const context = Exclusively.getContext("sample");  // same object as "const context" in sample1.js

context.fetch("https://example.com/");
```

### Multiple contexts
```javascript
import { Exclusively } from "exclusively";

const context1 = new Exclusively();
const context2 = new Exclusively();

                          // Network waterfall (example)
context1.fetch(request);  // |---|
context2.fetch(request);  // |----|
context1.fetch(request);  //     |----|
context2.fetch(request);  //      |--|
context1.fetch(request);  //          |----|
context2.fetch(request);  //         |----|
```
