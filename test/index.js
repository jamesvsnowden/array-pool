
var expect = require('chai').expect;
var ArrayPool = require('../dist/array-pool.cjs.js');

describe('array-pool', function() {

    describe('constructor', function() {

        it('should be a function', function() {
            expect(ArrayPool).to.be.a('function');
        });

        it('should return an ArrayPool instance', function() {
            expect(new ArrayPool()).to.be.an.instanceof(ArrayPool);
        });

        it('should integrate a custom create method', function() {
            function create(){}
            expect(new ArrayPool(create).$create).to.equal(create);
        });

        it('should ignore a non-function create method', function() {
            var create = {};
            expect(new ArrayPool(create).$create).to.not.equal(create);
        });

        it('should integrate a custom dispose method', function() {
            function dispose(){}
            expect(new ArrayPool(null, dispose).$dispose).to.equal(dispose);
        });

        it('should ignore a non-function dispose method', function() {
            var dispose = {};
            expect(new ArrayPool(null, dispose).$dispose).to.not.equal(dispose);
        });

        it('should act as an array pool', function() {
            expect(ArrayPool.$create).to.be.a('function');
            expect(ArrayPool.$dispose).to.be.a('function');
            expect(ArrayPool.acquire).to.be.a('function');
            expect(ArrayPool.release).to.be.a('function');
            expect(ArrayPool.acquire()).to.be.an('array');
            expect(ArrayPool.release([])).to.equal(1);
            ArrayPool.acquire();
        });

    });

    describe('$create [default]', function() {

        it('should be a function', function() {
            expect(new ArrayPool().$create).to.be.a('function');
        });

        it('should return an empty array', function() {
            var array = new ArrayPool().$create();
            expect(array).to.be.an('array');
            expect(array.length).to.equal(0);
        });

    });

    describe('$dispose [default]', function() {

        it('should be a function', function() {
            expect(new ArrayPool().$dispose).to.be.a('function');
        });

        it('should empty an array', function() {
            var array = [0,0,0];
            new ArrayPool().$dispose(array)
            expect(array.length).to.equal(0);
        });

    });

    describe('acquire', function() {

        it('should return an array', function() {
            expect(new ArrayPool().acquire()).to.be.an('array');
        });

        it('should not return the same array', function() {
            expect(new ArrayPool().acquire()).to.not.equal(new ArrayPool().acquire());
        });

    });

    describe('release', function() {

        it('should return the size of the pool', function() {
            var pool = new ArrayPool();
            expect(pool.release([])).to.equal(1);
            expect(pool.release([])).to.equal(2);
            pool.acquire();
            expect(pool.release([])).to.equal(2);
        });

    });

});