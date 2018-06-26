
var arr = []

for (var i = 0; i < 1552690; i++) {
    arr.push(Math.floor(Math.random() * 24))
}

var sub = []
arr.map((elem, index, array) => {
    var valid = sub.filter(f => f.n === elem)
    valid.length ? valid[0].count++ : sub.push({n: elem, count: 0})
})

console.log(sub)

// groupARR.map(function (elem) {
//     console.log('n: ' + elem[0] + ' count: ' + elem.length)
//     return elem
// })
