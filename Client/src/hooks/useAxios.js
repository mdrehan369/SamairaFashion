import axios from "axios";
import { useEffect, useState } from "react";

export const useAxios = (url='', method='GET', data={}) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState([]);
    let isMounted = true;

    useEffect(() => {
        ; (async () => {
            try {
                if (isMounted && url !== '') {

                    if (!(['GET', 'POST', 'PUT', 'DELETE'].some((field) => field.toLowerCase() === method.toLowerCase()))) {
                        throw new Error("Unknown HTTP Method");
                    }

                    const results = await axios({
                        url,
                        method,
                        data
                    });

                    // const results = await axios.get(url);

                    setResponse(results.data);

                }
            } catch (e) {
                console.log(e);
                setError(e);
            } finally {
                setLoading(false);
            }

        })()

        return () => (isMounted = false);
    }, [url, method]);

    return [loading, error, response];

}