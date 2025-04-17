import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/Home/HomePage'));
const AboutPage = lazy(() => import('../pages/About/AboutPage'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));

export { HomePage, AboutPage, ContactPage };