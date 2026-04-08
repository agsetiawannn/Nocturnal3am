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
    <link rel="icon" type="image/png" href="{{ asset('img/Exclude.png') }}?v=3am_update_4">
    <link rel="apple-touch-icon" href="{{ asset('img/Exclude.png') }}">
    <link rel="shortcut icon" href="{{ asset('img/Exclude.png') }}" type="image/x-icon">

    @if(!app()->environment('production'))
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @else
        <link rel="stylesheet" href="/public/build/assets/app-mYcLQiXB.css">
        <link rel="stylesheet" href="/public/build/assets/app-D26e3U-1.css">
        <script type="module" src="/public/build/assets/app-DGWOcAph.js"></script>
    @endif
</head>

<body class="antialiased bg-black" style="background-color: #000;">
    <div id="app"></div>
</body>

</html>