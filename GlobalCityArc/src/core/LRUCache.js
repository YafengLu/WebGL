// Adapted from https://github.com/isaacs/node-lru-cache

function hOP (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function naiveLength () {
  return 1; 
}

export function LRUCache (options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options);
  }

  if (typeof options === 'number') {
    options = {max: options};
  }

  if (!options) {
    options = {};
  }

  this._max = options.max;

  if (!this._max || this._max <= 0) {
    this._max = Infinity;
  }

  this._lengthCalculator = options.length || naiveLength;

  if (typeof this._lengthCalculator !== "function") {
    this._lengthCalculator = naiveLength;
  }

  this._allowStale = options.stale || false;
  this._maxAge = options.maxAge || null;
  this._dispose = options.dispose;
  this.reset();
}

Object.defineProperty(LRUCache.prototype, "max", {
  set: function (mL) {
    if (!mL || mL <= 0) {
      mL = Infinity;
    }

    this._max = mL;

    if (this._length > this._max) {
      trim(this);
    }
  },
  get: function () { 
    return this._max;
  },
  enumerable : true
});

Object.defineProperty(LRUCache.prototype, "lengthCalculator", {
  set: function (lC) {
    var key;

    if (typeof lC !== "function") {
      this._lengthCalculator = naiveLength;
      this._length = this._itemCount;
      for (key in this._cache) {
        this._cache[key].length = 1;
      }
    } else {
      this._lengthCalculator = lC;
      this._length = 0;
      for (key in this._cache) {
        this._cache[key].length = this._lengthCalculator(this._cache[key].value);
        this._length += this._cache[key].length;
      }
    }

    if (this._length > this._max) {
      trim(this);
    }
  },
  get: function () { 
    return this._lengthCalculator;
  },
  enumerable : true
});

Object.defineProperty(LRUCache.prototype, "length", {
  get: function () { 
    return this._length;
  },
  enumerable : true
});


Object.defineProperty(LRUCache.prototype, "itemCount", {
  get: function () { 
    return this._itemCount;
  },
  enumerable : true
});

LRUCache.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  var i = 0, hit;

  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) {
    if (this._lruList[k]) {
      hit = this._lruList[k];
      i ++;
      if (this._maxAge && (Date.now() - hit.now > this._maxAge)) {
        del(this, hit);
        if (!this._allowStale) {
          hit = undefined;
        }
      }
      if (hit) {
        fn.call(thisp, hit.value, hit.key, this);
      }
    }
  }
};

LRUCache.prototype.keys = function () {
  var keys = new Array(this._itemCount);
  var i = 0, hit;

  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) {

    if (this._lruList[k]) {
      hit = this._lruList[k];
      keys[i++] = hit.key;
    }
  }

  return keys;
};

LRUCache.prototype.values = function () {
  var values = new Array(this._itemCount);
  var i = 0, hit;

  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) {
    if (this._lruList[k]) {
      hit = this._lruList[k];
      values[i++] = hit.value;
    }
  }

  return values;
};

LRUCache.prototype.reset = function () {
  if (this._dispose && this._cache) {
    for (var k in this._cache) {
      this._dispose(k, this._cache[k].value);
    }
  }

  this._cache = Object.create(null);   //items by key
  this._lruList = Object.create(null); // items in order (use recency)
  this._mru = 0;    // most recently used
  this._lru = 0;    // least recently used
  this._length = 0; // number of items
  this._itemCount = 0;
};

LRUCache.prototype.dump = function () {
  return this._cache;
};

LRUCache.prototype.dumpLru = function () {
  return this._lruList;
};

LRUCache.prototype.set = function (key, value) {
  var len, age, hit;

  if (hOP(this._cache, key)) {

    if (this._dispose) {
      this._dispose(key, this._cache[key].value);
    }
    if (this._maxAge) {
      this._cache[key].now = Date.now();
    }

    this._cache[key].value = value;
    this.get(key);

    return true;
  }

  len = this._lengthCalculator(value);
  age = this._maxAge ? Date.now() : 0;
  hit = new Entry(key, value, this._mru++, len, age);

  // oversized objects fall out of cache
  if (hit.length > this._max) {
    if (this._dispose) {
      this._dispose(key, value);
    }

    return false;
  }

  this._length += hit.length;
  this._lruList[hit.lu] = this._cache[key] = hit;
  this._itemCount++;

  if (this._length > this._max) {
    trim(this);
  }
  return true;
};

LRUCache.prototype.has = function (key) {
  var hit = this._cache[key];

  if (!hOP(this._cache, key)) {
    return false;
  }

  if (this._maxAge && (Date.now() - hit.now > this._maxAge)) {
    return false;
  }
  return true;
};

LRUCache.prototype.get = function (key) {
  return get(this, key, true);
};

LRUCache.prototype.peek = function (key) {
  return get(this, key, false);
};

LRUCache.prototype.pop = function () {
  var hit = this._lruList[this._lru];
  del(this, hit);
  return hit || null;
};

LRUCache.prototype.del = function (key) {
  del(this, this._cache[key]);
};

function get(self, key, doUse) {
  var hit = self._cache[key];

  if (hit) {
    if (self._maxAge && (Date.now() - hit.now > self._maxAge)) {
      del(self, hit);
      if (!self._allowStale) {
        hit = undefined;
      }
    } else {
      if (doUse) {
        use(self, hit);
      }
    }
    if (hit) {
      hit = hit.value;
    }
  }

  return hit;
}

function use(self, hit) {
  shiftLU(self, hit);
  hit.lu = self._mru ++;
  self._lruList[hit.lu] = hit;
}

function trim(self) {
  while (self._lru < self._mru && self._length > self._max) {
    del(self, self._lruList[self._lru]);
  }
}

function shiftLU(self, hit) {
  delete self._lruList[hit.lu];
  while (self._lru < self._mru && !self._lruList[self._lru]) {
    self._lru ++;
  }
}

function del(self, hit) {
  if (hit) {
    if (self._dispose) {
      self._dispose(hit.key, hit.value);
    }
    self._length -= hit.length;
    self._itemCount --;
    delete self._cache[hit.key];
    shiftLU(self, hit);
  }
}

function Entry(key, value, lu, length, now) {
  this.key = key;
  this.value = value;
  this.lu = lu;
  this.length = length;
  this.now = now;
}
