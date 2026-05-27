import { useEffect } from "react";
import * as tracker from './lib';
import { useCallback } from "react";
import { useMemo } from "react";

export const BB: React.FC<{ allowViewMore: boolean }> = ({ allowViewMore }) => {
    useEffect(() => {
        tracker.exposure('bb_exposure')
    }, [])

    const isAllowViewMore = useMemo(() => {
        return allowViewMore
    }, [allowViewMore])

    useEffect(() => {
        if (isAllowViewMore) {
            tracker.exposure('comp_b_allow_view_more')
        } else {
            tracker.exposure('comp_b_not_allow_view_more')
        }
    }, [isAllowViewMore])

    useEffect(() => {

    }, [])

    return (
        <div>
            {isAllowViewMore && (
                <button onClick={() => {
                    tracker.click('click_view_more')
                }}>view more</button>
            )}
        </div>
    );
}

export default BB;