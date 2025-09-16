import { useState, useEffect } from 'react';

const useFetchHalls = (apiFunc) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        apiFunc()
            .then(res => {
                setData(res);
            })
            .catch(err => {
                console.error('❌ API Error:', err);
                setError(err);
            })
            .finally(() => {
                console.log('🏁 API call finished');
                setLoading(false);
            });
    }, [apiFunc]);

    return { data, loading, error };
};

export default useFetchHalls;