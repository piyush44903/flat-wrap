import test from 'ava';
const assert = require('assert');
const flatRedis = require('.');
const { flatten, unflatten } = flatRedis;

const atomicTypes = {
  String: 'Hello there',
  Number: 440.93,
  Boolean: true,
  // Date: new Date(),
  null: null,
  undefined: undefined,
};

const sampleNestedObjects = {
  baseBlank: {},
  emptyArray: [],
  blankNulls: { a: 12,b: { c:10, f: { g: {}, h: 19 }}, d: {}, e: [], k: null },
  nestedArrays: { a: 12,b: { c:10, f: { g: {}, h: 19, i: [10,20,30] }}, d: { j: [{ l: { m: 10 }}, { n: 10 }] }, e: [], k: null },
};

const sampleNestedTargets = {
  baseBlank: 'E_OBJ',
  emptyArray: 'E_ARR',
  blankNulls: { a: 12,
    'b.c': 10,
    'b.f.g': 'E_OBJ',
    'b.f.h': 19,
    d: 'E_OBJ',
    e: 'E_ARR',
    k: 'E_NULL',
  },
  nestedArrays: { a: 12,
    'b.c': 10,
    'b.f.g': 'E_OBJ',
    'b.f.h': 19,
    'b.f.i.0': 10,
    'b.f.i.1': 20,
    'b.f.i.2': 30,
    'd.j.0.l.m': 10,
    'd.j.1.n': 10,
    e: 'E_ARR',
    k: 'E_NULL',
  },
};

Object.keys(atomicTypes).forEach(key => {
  test(`Atomic flattening type ${key}`, async t => {
    const flresp = flatten(atomicTypes[key]);
    // console.log(fresp, atomicTypes[key]);
    if (flresp === atomicTypes[key]) {
      t.pass();
      return;
    }
    t.fail();
  });
});

Object.keys(atomicTypes).forEach(key => {
  test(`Atomic unflattening type ${key}`, async t => {
    const flresp = unflatten(atomicTypes[key]);
    // console.log(fresp, atomicTypes[key]);
    if (flresp === atomicTypes[key]) {
      t.pass();
      return;
    }
    t.fail();
  });
});

test.failing('Date object test', t => {
  const base = new Date();
  const fresp = flatten(base);

  if (fresp === base) {
    t.pass();
    return;
  }
  t.fail();
});

Object.keys(sampleNestedObjects).forEach(key => {
  test(`Nested flattening sample ${key}`, async t => {
    const flresp = flatten(sampleNestedObjects[key], { filterNulls: false });
    t.deepEqual(flresp, sampleNestedTargets[key]);
  });
});

Object.keys(sampleNestedObjects).forEach(key => {
  test(`Nested unflattening sample ${key}`, async t => {
    const flresp = unflatten(sampleNestedTargets[key], { filterNulls: false });
    t.deepEqual(flresp, sampleNestedObjects[key]);
  });
});
