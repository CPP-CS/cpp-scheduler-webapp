import { Html, Main, NextScript, Head } from "next/document";

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta charSet='utf-8' />
        <link rel='icon' href='%PUBLIC_URL%/favicon.ico' />

        <meta name='theme-color' content='#000000' />
        <meta
          name='description'
          content='Course planning and information for Calpoly students. CPP Scheduler provides a Schedule Builder, Professor Grades, Course Grades, Course Search, and various other resources.'
        />
        <link rel='apple-touch-icon' href='%PUBLIC_URL%/favicon.png' />
        {/* <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    --> */}
        <link rel='manifest' href='%PUBLIC_URL%/manifest.json' />
        {/* <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    --> */}

        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4026579723631755'
          crossOrigin='anonymous'></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
