/**
 * Creates an ArrayPool. The 'create' and 'dispose' methods can be overriden
 * when instantiating an array pool by passing them to the constructor
 * function. For example, to create a pool of point vectors:
 * 
 * @example
 * const points = new ArrayPool(
 *     function create() {
 *         return [0, 0];
 *     },
 *     function dispose(point) {
 *         point[0] = point[1] = 0;
 *     }
 * );
 *
 * @public
 * @constructor
 * @param {Function} [create] Method to use to create and initialize new array
 *                            instances.
 * @param {Function} [dispose] Method to use to dispose of array instances
 *                             before adding them to the pool.
 */
function ArrayPool(create, dispose) {

    /**
     * The internal array pool
     * 
     * @private
     * @type {Array}
     */
    this._arrays = [];
    
    if (typeof create === 'function') {
        this.$create = create;
    }
    
    if (typeof dispose === 'function') {
        this.$dispose = dispose;
    }

};

ArrayPool.call(ArrayPool,

    /**
     * Creates and initializes a new instanceof an array. This method is
     * called when an array is requested from the pool while the pool is empty.
     * The default behavior is to simply return an empty Array. It can be
     * overriden either by sub-classing ArrayPool, or when instantiating a new
     * ArrayPool by passing your custom 'create' method as the first argument
     * to the constructor function, for example, implementing a 3D matrix array
     * pool might look like this:
     *
     * @example <caption>Custom create function</caption>
     * const matrices = new ArrayPool(function() {
     *     const m = new Float32Array(16);
     *     m[0]=m[5]=m[10]=m[15]=1;
     *     m[1]=m[2]=m[3]=m[4]=m[6]=m[7]=m[8]=m[9]=m[11]=m[12]=m[13]=m[14]=0;
     *     return m;
     * });
     *
     * @protected
     * @return {Array} Create and initialize a new array instance.
     */
    ArrayPool.prototype.$create = function() {
        return [];
    },

    /**
     * Dispose of an array before adding it to the pool. This method is called
     * whenever an array is released into the pool, before adding the array to
     * the pools internal data cache. The default behavior is to clear the
     * array by setting it's length to 0. It can be overriden either by
     * sub-classing ArrayPool, or when instantiating a new ArrayPool by passing
     * your custom 'dispose' method as the second argument to the constructor
     * function, for example, implementing a 3D vector array pool might look
     * like this:
     *
     * @example <caption>Custom dipose function</caption>
     * const vectors = new ArrayPool(
     *     function create() {
     *         return [0, 0, 0];
     *     },
     *     function dispose(vector) {
     *         vector[0] = vector[1] = vector[2] = 0;
     *     }
     * );
     *
     * @protected
     * @param  {Array} array The array to dispose of
     * @return {void}
     */
    ArrayPool.prototype.$dispose = function(array) {
        array.length = 0;
    }

);

/**
 * Retrieves an array from the pool. If the pool is empty a new array will be
 * created and returned.
 *
 * @public
 * @return {Array} Returns an array from the pool.
 */
ArrayPool.acquire = ArrayPool.prototype.acquire = function acquire() {
    return this._arrays.length === 0 ? this.$create() : this._arrays.pop();
};

/**
 * Adds an array into the pool.
 * 
 * @param  {Array} array The array to release into the pool.
 * @return {Number} The count of arrays in the pool after the array has been added.
 */
ArrayPool.release = ArrayPool.prototype.release = function release(array) {
    this.$dispose(array);
    return this._arrays.push(array);
};
