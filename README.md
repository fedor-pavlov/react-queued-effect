# react-queued-effect

React useQueuedEffect hook that lets you to queue up effects and run them 1-by-1

# Why useQueuedEffect?

useQueuedEffect is usefull whenever you need to run your effects one after another.

A realworld example: @react-pdf/renderer library (which is awesome library, by the way) allows you to generate PDF docs on the fly with React, but currently (Aug 2021) it fails to generate more than one document at a time. So if you need to generate more than 1 document on a page, you'd need to queue the docs up in order to render them one by one.

# How to use it

The usage of this hook is quite simple and straightforward.
The only gotcha you should be aware of is the "useCallback". It's strongly recommended to wrap your effects with the useCallback and respect effect's dependencies in order to avoid infinite update loops.

```javascript
import { useCallback     } from 'react'
import { useQueuedEffect } from 'react-queued-effect'

function SomeComponent() {

    // (1) wrap your effect with useCallback
    const someEffect = useCallback(() => { /* do something here */ }, [ /* dependencies go here (if there are any) */ ])

    // (2) pass it to useQueuedEffect
    useQueuedEffect(someEffect)

    // (3) and that's it!
    return ( /* ... */ )
}
```

### Example

This code illustrate how useQueuedEffect works with a bunch of components. The goal would be to update these components' state in a 1-by-1 fashion:

```javascript
import   React             from 'react'
import   ReactDOM          from 'react-dom'
import { useCallback     } from 'react'
import { useQueuedEffect } from 'react-queued-effect'


function MyComponent({ id }) {

    const [ done, setDone ] = useState(false)

    // It's essential to wrap your queued effects with useCallback hook,
    // otherwise it's easy to end up with infinite loop of updates
    useQueuedEffect(useCallback(() => {

        // Here you can do some stuff that needs to be done 1-by-1.
        // This is just a dummy sample code that basically do nothing,
        // it just delays component's state update:

        console.log(`calling effect for id=${id}`)
        const delay = 1000

        // useQueuedEffect respects Promises as results of callback functions:
        return new Promise(resolve => {

            setTimeout(() => { setDone(true); resolve() }, delay)
        })

        // And don't lie to React on your callback's real dependencies:
    }, [id] ))

    return <span>{ done ? `ID:${id} is done` : `waiting for ID=${id}` }</span>
}


function App() {

    // Let's generate a bunch of test components
    // and see how they get updated nicely in a 1-by-1 manner

    const testCount = 1000

    return (
        <ul>
            { [...new Array(testCount)].map((_,n) => <li key={n}><MyComponent id={n}/></li>) }
        </ul>
    )
}


ReactDOM.render( <App />, document.getElementById('root') )
```