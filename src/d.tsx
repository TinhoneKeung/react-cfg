import * as tracker from './b';
import { useEffect } from 'react';

export const DD = () => {
    useEffect(() => {
        tracker.exposure('comp_dd_exposure')
    }, [])

    return ( 
        <div></div>
     );
}
 
export default DD;