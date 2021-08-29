import { useState, useEffect } from 'react'

let GLOBAL_QUEUE = Promise.resolve(0);





function useQueue() {

    const [ job, setJob ] = useState({ pending: true, next: undefined })

    useEffect(() => {

        GLOBAL_QUEUE = GLOBAL_QUEUE.then(() => new Promise(resolve => setJob({ pending: false, next: resolve })).catch(console.error))

    }, [setJob])

    return [job.pending, job.next ]
}





function useQueuedEffect(callback) {

    useEffect(() => {

        GLOBAL_QUEUE = GLOBAL_QUEUE.then(() => new Promise(resolve => {

            const p = callback()

            if (p instanceof Promise) {

                return p.then(resolve, resolve)
            }

            resolve(p)

        }).catch(console.error))

    }, [ callback ])
}





export { useQueue, useQueuedEffect }