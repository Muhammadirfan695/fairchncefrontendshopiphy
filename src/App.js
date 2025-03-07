// import './locales/i18n';
// import 'simplebar-react/dist/simplebar.min.css';
// import 'yet-another-react-lightbox/styles.css';
// import 'yet-another-react-lightbox/plugins/captions.css';
// import 'yet-another-react-lightbox/plugins/thumbnails.css';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import 'react-quill/dist/quill.snow.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import 'react-lazy-load-image-component/src/effects/blur.css';

// import Router from './routes/sections';
// import ThemeProvider from 'src/theme';
// import { LocalizationProvider } from 'src/locales';
// import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// import ProgressBar from 'src/components/progress-bar';
// import { MotionLazy } from 'src/components/animate/motion-lazy';
// import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
// import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
// import { CheckoutProvider } from 'src/sections/checkout/context';
import LocalizationProvider from './locales/localization-provider';
import { AuthProvider } from './auth/context/jwt/auth-context';  // Only one AuthProvider here

export default function App() {
  // useScrollToTop();

      return (
        <AuthProvider>  {/* Ensure AuthProvider wraps everything */}
          <LocalizationProvider>
            hkkh
            {/* <SettingsProvider
              defaultSettings={{
                themeMode: 'light',
                themeDirection: 'ltr',
                themeContrast: 'default',
                themeLayout: 'vertical',
                themeColorPresets: 'default',
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SnackbarProvider>
                    <CheckoutProvider>
                      <SettingsDrawer />
                      <ProgressBar />
                      <Router />
                    </CheckoutProvider>
                  </SnackbarProvider>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider> */}
          </LocalizationProvider>
        </AuthProvider>
      );
    };