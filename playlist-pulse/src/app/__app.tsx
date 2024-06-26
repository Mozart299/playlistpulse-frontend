
import { AppProps } from 'next/app';
import { StateProvider } from './utils/context/StateProvider';
import reducer, { initialState } from './utils/context/reducer';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <StateProvider initialState={initialState} reducer={reducer}>
    <Component {...pageProps} />
  </StateProvider>
);

export default MyApp;
