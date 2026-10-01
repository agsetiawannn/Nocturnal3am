<!DOCTYPE html>
<html lang="id" style="background-color: #000;">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Tigapagi | Bali Creative Agency</title>

  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta name="referrer" content="strict-origin-when-cross-origin">

  <!-- Open Graph / Social Sharing -->
  <meta property="og:title" content="Tigapagi | Bali Creative Agency">
  <meta property="og:type" content="website">
  <meta property="og:image" content="{{ asset('img/logo tp kotak.png') }}">

  <!-- Web App Manifest -->
  <link rel="manifest" href="{{ asset('manifest.json') }}">
  <meta name="theme-color" content="#3d6b64">

  <!-- Icons / Add to Home Screen -->
  <link rel="apple-touch-icon" href="{{ asset('img/icon-180x180.png') }}?v=update_10">
  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('img/icon-180x180.png') }}?v=update_10">
  <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('img/icon-192x192.png') }}?v=update_10">
  <link rel="apple-touch-icon" sizes="192x192" href="{{ asset('img/icon-192x192.png') }}?v=update_10">
  <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('img/icon-192x192.png') }}?v=update_10">
  <link rel="shortcut icon" href="{{ asset('favicon.ico') }}?v=update_10">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Tigapagi">

  @viteReactRefresh
  @vite(['resources/css/app.css', 'resources/js/app.jsx'])

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18477482984"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'AW-18477482984');
  </script>
</head>

<body class="antialiased bg-black" style="background-color: #000;">
  <div id="app"></div>
</body>

</html>