import {css} from '../css';
import { Footer } from './atoms/Footer';
import { Background } from './atoms/Background';

type LayoutOptions = {
  children:any;
  title?:string;
};

export function Layout ({children, title = "atomic-tetris"}:LayoutOptions) {
  css.root({
    strong: {fontWeight: 600},
  });

  return (
    <html className={css({fontSize: '62.5%'})}>
      <head>
        <title>{title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/public/favicon.ico" />
        {/* Icons and Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital@0;1&display=swap" rel="stylesheet"></link>
      </head>
      <body className={css.use('f', 'fv', 'fa_c', 'fj_c', {
        width: '100vw',
        height: '100vh',
        fontFamily: css.$v.fontFamilyBody,
        fontSize: css.$v.fontSizeBody,
        background: css.$t.bg,
        color: css.$t.fg,
      })}>
        <Background />
        {children}
        <Footer />
      </body>
    </html>
  );
}
