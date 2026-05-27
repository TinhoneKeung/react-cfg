import * as tracker from './lib';
async function sleep(timeout: number = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('done')
        }, timeout);
    })
}

export async function simulateFetch(timeout: number) {
    tracker.click('simulateFetch', {
        itraceConfig: {
            dims: [{ timeout }]
        }
    })
    return await sleep(timeout)
}


export function langChainCall1() {
    tracker.click('langChainCall1')
    langChainCall2()
}
export function langChainCall2() {
    langChainCall3()
}
export function langChainCall3() {
    tracker.click('langChainCall3', {
        itraceConfig: {
            dims: [{
                longchain: true
            }]
        }
    })
}

export function aDeadCodeFuncButWithItraceReport() {
    tracker.click('report_whatever_somethings')
}