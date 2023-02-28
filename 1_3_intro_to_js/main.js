


let count = 0

function buttonCounter() {
    count++
    document.getElementById("buttonClicks").innerHTML = count
  }






// let foodCount = 0
// let foodArray = []

// function foodCounter() {
//     foodCount++
//     document.getElementById("foodCount").innerHTML = foodCount
//     const food = document.getElementById('food-input').value
//     foodArray[foodArray.length]=food
//     document.getElementById('food-list').innerHTML = foodArray
// }

// function reset() {
//     foodCount=0
//     foodArray=[]
//     document.getElementById("foodCount").innerHTML = foodCount
//     document.getElementById('food-list').innerHTML = foodArray
// }





//CODE FROM CLASS

// //console.log('hello world');

// //console.log(document)
// //console.log(window)
// let changeable = true
// const constant = true
// let counter = 0



// // const input = document.getElementById("name-input")
// // console.log(input)

// // const updateName = () => {
// //     console.log('in update function')
// //     const userName = input.value;
// //     window.alert(`hello, welcome to class ${userName}!`)
// // }

// // updateName()

// const array = ["apple", "orange", "banana", "mango", "toast"]

// const newArray = array.map((d) => {
//     //console.log('d',d)
//     return `my favorite food is ${d}`
// })

// //console.log(newArray)

// const filterdArray = array.filter((d, i) => {
//     const onlyToast = d === "toast"
//     const onlyFruit = d !== "toast"
//     const applesOrOranges = d === "apple" || d === "orange"
//     const laterFoods = i > 0
//     return laterFoods
// })

// //console.log(filterdArray.length)

// //array.forEach(d => console.log('t', d))

// const dataVisClass = {
//     day: 'Tuesday',
//     time: 'late',
//     students: 15,
// }

// // const dayAccessor = 'day'
// // const day = dataVisClass[dayAccessor]
// // console.log('day', day)

// // const keys = Object.keys(dataVisClass)
// // console.log(keys)

// // const values = Object.values(dataVisClass)
// // console.log(values)

// // const entries = Object.entries(dataVisClass)
// // console.log(entries)

// // const apple = 'orange'
// // if(apple === 'apple'){
// //     console.log("I'm an apple")
// // }else {
// //     console.log("I'm not an apple!")
// // }

// // const yesApple = apple === "apple" ? "I'm an apple!" : "I'm not an apple!"
// // console.log(yesApple)

// // const now = new Date()
// // console.log(now)