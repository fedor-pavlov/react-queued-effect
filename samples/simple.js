import   React             from 'react'
import   ReactDOM          from 'react-dom'
import { useCallback     } from 'react'
import { useQueuedEffect } from 'react-queued-effect'



function MyComponent({ id }) {

    const [ done, setDone ] = useState(false)

    // It's essential to wrap your queued effects with useCallback hook,
    // otherwise it's easy to end up with infinite loop of updates 
    
    useQueuedEffect(useCallback(() => {

        // do some stuff that needs to be done 1-by-1

        console.log(`calling effect for id=${id}`)
        const delay = 1000
        const timer = setTimeout(() => setDone(true), delay)
        return () => clearTimeout(timer)

        // And don't lie to React on your callback real dependecies:

    }, [id] ))

    return <span>{ done ? `ID:${id} is done` : `waiting for ID=${id}` }</span>
}



function App() {

    const testCount = 1000

    return (

        <ul>
            { [...new Array(testCount)].map((_,n) => <li key={n}><MyComponent id={n}/></li>) }
        </ul>
    )
}



ReactDOM.render( <App />, document.getElementById('root') )