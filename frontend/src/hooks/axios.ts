import axios, { Method } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { config } from 'src/config';

const { apiUrl } = config

const useAxios = <Payload, ResponseData>(route: string, method: Method | string, payload: Payload) => {
  const [data, setData] = useState<ResponseData | null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.request({
          data: payload,
          signal: controllerRef.current.signal,
          method,
          url: apiUrl + route,
        });
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, [route, method, payload]);
  return { cancel, data, error, loaded };
};

export default useAxios;