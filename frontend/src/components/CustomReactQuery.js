import { useEffect, useState } from "react";
import Axios from 'axios';

export const CustomReactQuery = (urlPath) => {
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
        try {
            setLoading(true)
            setError(false)
            const response = await Axios.get(urlPath)
            console.log(response.data);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
        })()
    }, [])
    return [data, error, loading]
}