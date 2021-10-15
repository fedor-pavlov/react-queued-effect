import { useState, useEffect } from 'react'





///////
/////// TYPE DEFINITIONS
///////

type IQueueCallback = () => void | Promise<any>
type IQueue = Promise<any> 
type INextFunction = (value: unknown) => void

interface IJob {

    pending : boolean
    next?   : INextFunction
}





///////
/////// GLOBAL QUEUE
///////

let GLOBAL_QUEUE : IQueue = Promise.resolve(0);





///////
/////// HOOK useQueue
///////

function useQueue() {

    const [ job, setJob ] = useState<IJob>({ pending: true, next: undefined })

    useEffect(() => {

        GLOBAL_QUEUE = GLOBAL_QUEUE.then(() => new Promise(resolve => setJob({ pending: false, next: resolve })).catch(console.error))

    }, [setJob])

    return [job.pending, job.next ]
}





///////
/////// HOOK useQueue
///////

function useQueuedEffect(callback: IQueueCallback) {

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





///////
/////// EXPORTS
///////

export { useQueue, useQueuedEffect, IQueueCallback }