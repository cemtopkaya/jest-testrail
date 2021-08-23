/**
 * EventEmitter emit olmayı beklemeden node çıkar
 */
// const { EventEmitter } = require('events')
// const ev = new EventEmitter()
// ev.on("event", (e) => { console.log("event:", e) })


// /**
//  * Promise tamamlanmadan çıkar
//  */
// const p = new Promise( resolve => {
//     if(false) 
//         resolve()
// })

// p.then(console.log)


// /**
//  * set[Timeout|Interval] durdurur çıkışı
//  */
// const {EventEmitter} = require('events')

// const ev = new EventEmitter()
// ev.on("event", (e) => console.log("event:", e))

// const timer = setInterval(() => ev.emit("event", "fired!"), 1000)

// setInterval(() => console.log("event !"), 1000)