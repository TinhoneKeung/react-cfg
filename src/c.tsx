import { useEffect,forwardRef, useImperativeHandle } from "react";
import * as tracker from './lib';
import { useState } from "react";

export const CC = forwardRef<{
    open:() => void
}, {
    onConfirm: () => void
}>(({onConfirm}, ref) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        tracker.exposure('cc_exposure')
    }, [])

    useImperativeHandle(ref, () => {
        return {
            open() {
                setVisible(true)
                tracker.exposure('handle_modal_open')
            },
        }
    },[])

    useEffect(() => {

    }, [])

    return (
        <div>
            {visible && (
                <button onClick={() => {
                    setVisible(false)
                    tracker.click('handle_modal_close')
                    onConfirm()
                }}>close</button>
            )}
        </div>
    );
})

export default CC;