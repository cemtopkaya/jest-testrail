async function hello() {
    fnPromiseResolve = function(){
        return new Promise((resolve,rej)=>{
            setTimeout(() => {
                resolve('Ali')
            }, 2000); 
        })
    }
    fnPromiseReject = function(){
        return new Promise((resolve,rej)=>{
            setTimeout(() => {
                rej('veli')
            }, 1000); 
        })
    }
    promiseArr = [fnPromiseResolve(), 12,fnPromiseResolve(), true]
    greeting = await Promise.race(promiseArr)
  console.log('greeting',greeting);
  return greeting
  };
  hello() //.then(alert);