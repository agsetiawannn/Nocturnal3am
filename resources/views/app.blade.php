<!DOCTYPE html>
<html lang="id" style="background-color: #000;">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Tigapagi - Creative Agency</title>

    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta name="referrer" content="strict-origin-when-cross-origin">

    <!-- Open Graph / Social Sharing -->
    <meta property="og:title" content="Tigapagi - Creative Agency">
    <meta property="og:type" content="website">
    <meta property="og:image" content="{{ asset('img/logo tp kotak.png') }}">

    <!-- Icons / Add to Home Screen -->
    <link rel="icon" type="image/webp" href="{{ asset('img/tp lg.webp') }}?v=update_8">
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}?v=update_8">
    <link rel="apple-touch-icon" href="{{ asset('img/logo tp kotak.png') }}?v=update_8">
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}?v=update_8">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>

<body class="antialiased bg-black" style="background-color: #000;">
    <div id="app"></div>
</body>

</html>