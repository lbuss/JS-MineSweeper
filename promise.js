function Promise(executor){
  var resolve, reject;
  var resolvesArray = [];
  var rejectsArray = [];
  this.resolved = false;

  resolve = function(value){
    if (!this.resolved){
      //value is our key value that resolves this promise
      if(value && value.then){
        //this thing is a promise
        //therefore: we cannot TRULY resolve ourself with this value
        //instead we must wait until this promise is resolved,
        //THEN we can resolve ourself with this value
        value.then(function(realValue){
          resolvesArray.forEach(function(el){
            var chainCallback = el[0];
            var chainPromiseResolve = el[1];
            var chainPromiseReject = el[2];
            if (isFunction(chainPromiseResolve)){
              chainPromiseResolve(chainCallback(realValue));
            }else{
              chainCallback(realValue);
            }

          });
        })

      } else{
        resolvesArray.forEach(function(el){
          var chainCallback = el[0];
          var chainPromiseResolve = el[1];
          var chainPromiseReject = el[2];
          if (isFunction(chainPromiseResolve)){
            chainPromiseResolve(chainCallback(value));
          }else{
            chainCallback(value);
          }
        });}

        this.resolved = true
      }
    }

    reject = function(value){
      if (!this.resolved){

        resolvesArray.forEach(function(el){
          var chainCallback = el[0];
          var chainPromiseResolve = el[1];
          var chainPromiseReject = el[2];
          if (isFunction(chainPromiseReject)){
            chainPromiseReject(chainCallback(value));
          }

        });
        this.resolved = true;
      }

    }

    this.then = function(callback){
      //keep track of callback so we can execute it when this promise
      //is resolved

      var chainPromise = new Promise(function(resolve, reject){
        resolvesArray.push([callback, resolve, reject]);
      });

      return chainPromise;
    };

    executor(resolve, reject);

    isFunction = function(functionToCheck) {
      var getType = {};
      return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
  }

  Promise.all = function(array){
    return new MyPromise(function(resolve, reject){
      var tally = 0;
      array.forEach(function(promise){
        promise.then(function(){tallyPlus();})
      })

      var tallyPlus = function(){
        tally++;
        if (tally === array.length){
          console.log("Smiles and rainbows");
          resolve();
        }
      }
    })
  }
  //
  // function fiveMachine(){
  //   var value = 5;
  //
  //   return new Promise(function(resolve, reject){
  //     setTimeout(function(){
  //       resolve(value);
  //
  //     }, 1000);
  //   });
  //
  // }
  //
  // function logCallback(value){
  //   console.log('got ' + value);
  // }
  //
  // function add37(value){
  //   return new MyPromise(function(resolve, reject){
  //     setTimeout(function(){
  //       resolve(value + 37);
  //     }, 1000);
  //   });
  // }
  //
  //
  // module.exports = {
  //   resolved: function(value){
  //     return new Promise(function(resolve){
  //       resolve(value);
  //     });
  //   },
  //
  //   rejected: function(value){
  //     return new Promise(function(resolve, reject){
  //       reject(value);
  //     })
  //   },
  //
  //   deferred: function () {
  //     var resolve, reject;
  //
  //     return {
  //       promise: new Promise(function (rslv, rjct) {
  //         resolve = rslv;
  //         reject = rjct;
  //       }),
  //       resolve: resolve,
  //       reject: reject
  //     };
  //   }
  // };

  // fiveMachine().then(add37, logCallback).then(logCallback);

  // MyPromise.all([fiveMachine(), fiveMachine().then(logCallback)]);
