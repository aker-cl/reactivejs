# ReactiveJS

This functions add reactivity to any variables: Strings, Number, Arrays, etc.

## _Reactive example_

```js
import { Reactive } from 'teseract-reactivejs'

const test = document.querySelector('#test')
const test2 = document.querySelector('#test2')

Reactive.def('count', 0, value => {
    test.innerHTML = value
    Reactive.count2 = value * 2
})

Reactive.def('count2', 0, () => {
    test2.innerHTML = Reactive.count * 2
})

setInterval(() => {
    Reactive.count++
}, 1000)
```

## _ReactiveV2 example_

```js
import { ReactiveV2 } from 'teseract-reactivejs'

const reactiveNumber = ReactiveV2(0, (value) => {
    console.log(value)
})

const reactiveArray = ReactiveV2([], value => {
    console.log(value)
})

setInterval(() => {
    reactiveNumber.value += 3
    reactiveArray.value.push(reactiveArray.value.length + 1)
}, 1000)
```