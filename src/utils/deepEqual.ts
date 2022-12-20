function isPrimitive(obj) {
  return typeof obj !== 'object' && typeof obj !== 'function';
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    // it's just the same object. No need to compare.
    return true;
  }

  if (isPrimitive(obj1) || isPrimitive(obj2)) {
    // compare primitives
    return obj1 === obj2;
  }

  //if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  // compare objects with same number of keys
  for (const key in obj1) {
    //if (!(key in obj2)) return false; // other object doesn't have this prop
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

export { deepEqual };
