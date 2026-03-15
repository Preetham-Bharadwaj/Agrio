import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'hi', 'kn', 'te', 'mr', 'ta'];

export default getRequestConfig(async (props) => {
  // Use props.locale only — do not call getLocale() here; it causes getRequestConfig
  // to be re-entered and leads to "Maximum call stack size exceeded".
  const locale =
    props.locale && locales.includes(props.locale as string) ? props.locale : 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});


