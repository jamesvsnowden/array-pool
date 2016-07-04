define(function(){

function ArrayPool(create, dispose) {
    
    
    this._arrays = [];
    
    if (typeof create === 'function') {
        this.$create = create;
    }
    
    if (typeof dispose === 'function') {
        this.$dispose = dispose;
    }

};

ArrayPool.call(ArrayPool,

    
    ArrayPool.prototype.$create = function() {
        return [];
    },

    
    ArrayPool.prototype.$dispose = function(array) {
        array.length = 0;
    }

);


ArrayPool.acquire = ArrayPool.prototype.acquire = function acquire() {
    return this._arrays.length === 0 ? this.$create() : this._arrays.pop();
};


ArrayPool.release = ArrayPool.prototype.release = function release(array) {
    this.$dispose(array);
    return this._arrays.push(array);
};


return ArrayPool;

});