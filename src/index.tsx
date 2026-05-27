import { useEffect } from "react";
import * as tracker from './lib';
import { useCallback } from "react";
import { DD } from './d';
import { CC } from './c';
import { BB } from './b';
import { simulateFetch, langChainCall1, langChainCall2 } from './util';
import { useState } from "react";
import { useRef } from "react";

const Index = () => {
    const [allowViewMore, setallowViewMore] = useState(false)
    const [showDD, setShowDD] = useState(false)
    const modelRef = useRef<{ open: () => void }>(null)

    useEffect(() => {
        // 初始化全局参数
        tracker.initBaseGoldLog('', {
            itraceKey: 'demo_flow',
            itraceConfig: {
                dims: [
                    { globalDim0: '' },
                    { globalDim1: '' },
                    { globalDim2: '' },
                    { globalDim3: '' },
                ]
            }
        })
    }, [])

    useEffect(() => {
        // 普通曝光
        tracker.exposure('page_exposure')
    }, [])

    useEffect(() => {
        const isNeedRedirect = location.search.includes('redirect')
        if (isNeedRedirect) {
            tracker.exposure('jump_to_404_case1')
            // 跳转，理论上这就是这个页面的最后一个节点了，后面的都不会发生
        } else {
            tracker.exposure('page_normal_exposure_case1')
        }

        // 三元
        isNeedRedirect ? tracker.exposure('jump_to_404_case2') : tracker.exposure('page_normal_exposure_case2')
        // 内联三元
        tracker.exposure(isNeedRedirect ? 'jump_to_404_case3' : 'page_normal_exposure_case3')

        const searchParams =  new URLSearchParams(location.search)
        let type: 'success' | 'fail' | undefined = searchParams.get('type') as any

        // switch case
        switch (type) {
            case 'success':
                tracker.click('type_success')
                break;
            case 'fail':
                tracker.click('type_fail')
                break;
            default:
                tracker.click('type_undefined')
                break;
        }

        if (isNeedRedirect) {
            tracker.click("homepage_start_jump")
            window.location.href = '/next-page'
        }
    }, [])

    const handleCancle = useCallback(async () => {
        tracker.click('user_cancle')
        langChainCall1()
        tracker.click('user_make_chose')

        await simulateFetch(300)
        tracker.click('order_async1')
        await simulateFetch(200)
        tracker.click('order_async2')
    }, [])

    const secondFetch = useCallback(() => {
        return simulateFetch(500).then((result) => {
            tracker.click('get_second_fetch_data')
            return result
        }).catch((err: any) => {
            console.log(err);
            tracker.click('get_second_fetch_data_error')
        });
    }, [])

    const competitionFetch = useCallback(() => {
        return simulateFetch(Math.floor(Math.random() * 1000)).then((result) => {
            tracker.click('competition_fetch_data')
            return result
        }).catch((err: any) => {
            console.log(err);
            tracker.click('competition_fetch_data_error')
        });
    }, [])

    useEffect(() => {
        // 异步场景
        simulateFetch(300)
            .then(async () => {
                tracker.click('get_user_data')
                // 异步嵌套
                secondFetch().then((result) => {
                    const isAllow = (result as any)?.isAllow

                    tracker.click(`get_second_fetch_data_withResult_${isAllow}`)
                    tracker.click('get_second_fetch_data_done', {
                        itraceConfig: {
                            dims: [{ isAllow }]
                        }
                    })

                    // 异步更新全局参数
                    tracker.initBaseGoldLogParams({
                        itraceConfig: {
                            dims: [{ isAllow }]
                        }
                    })
                    setallowViewMore(isAllow)
                }).catch((err: any) => {
                    console.log(err);
                    tracker.click('get_second_fetch_data_error')
                });

                // 竞争请求，生成一个 0-1000ms 的随机异步请求，可能在 secondFetch 前完成，也可能在其之后
                competitionFetch().then(() => {
                    tracker.click('competition_fetch_data_done')
                }).finally(() => {
                    tracker.click('competition_fetch_data_finally')
                })
            })
            .catch(() => {
                tracker.click('get_user_data_error')
            })
            .finally(() => {
                tracker.click('get_user_data_finally')
            })
    }, [])

    const handleClose = useCallback(() => {
        tracker.click('listen_model_close')
        langChainCall2()
        setShowDD(true)
    }, [])

    return (
        <div>
            <BB allowViewMore={allowViewMore}></BB>
            <CC ref={modelRef} onConfirm={handleClose}></CC>
            {showDD && <DD></DD>}
            <button onClick={async () => {
                tracker.click('handle_action_button_click')
                const result = await competitionFetch()
                console.log(result);
            }}>aplly now</button>
            <button onClick={handleCancle}>not now</button>
            <button onClick={() => {
                modelRef?.current?.open()
            }}>open modal</button>
        </div>
    );
}

export default Index;