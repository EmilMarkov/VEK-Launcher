import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { set, get, del } from 'idb-keyval';

type Response<T> = [
    T,
    Dispatch<SetStateAction<T>>,
    boolean
]

function useTemporaryState<T>(key: string, initialState: T): Response<T> {
    const [state, setState] = useState<T>(initialState);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const storedValue = await get(key);
            if (storedValue !== undefined) {
                setState(storedValue);
            }
            setIsInitialized(true);
        };
        fetchData();
    }, [key]);

    useEffect(() => {
        if (isInitialized) {
            set(key, state);
        }
    }, [key, state, isInitialized]);

    useEffect(() => {
        const handleUnload = () => {
            del(key);
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [key]);

    return [state, setState, isInitialized];
}

export default useTemporaryState;
