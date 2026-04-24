<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kos Baru di Manokos</title>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1a1a1a; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f7f6; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0f9b98, #13c2bf); color: #fff; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .property-card { border: 1px solid #eee; border-radius: 12px; padding: 15px; margin-bottom: 20px; text-decoration: none; color: inherit; display: block; }
        .property-card:hover { border-color: #0f9b98; }
        .property-img { width: 100%; height: 180px; object-cover: cover; border-radius: 8px; margin-bottom: 12px; }
        .property-title { font-size: 18px; font-weight: 700; margin: 0 0 5px; color: #0f9b98; }
        .property-price { font-weight: 800; color: #1a1a1a; margin-bottom: 5px; }
        .property-area { font-size: 13px; color: #666; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #999; }
        .unsubscribe { color: #999; text-decoration: underline; }
        .btn { display: inline-block; padding: 12px 24px; background: #0f9b98; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Manokos</h1>
            <p>Ada Kos Baru Menarik Untukmu!</p>
        </div>
        <div class="content">
            <p>Halo, <strong>{{ $user->name }}</strong>!</p>
            <p>Beberapa kos baru baru saja ditambahkan di kawasan favorit Anda. Cek sekarang sebelum keduluan orang lain!</p>
            
            @foreach($properties as $property)
            <a href="https://manokos.id/kos/{{ $property->id }}" class="property-card">
                <img src="{{ Str::startsWith($property->main_image, 'http') ? $property->main_image : asset('storage/'.$property->main_image) }}" class="property-img">
                <h3 class="property-title">{{ $property->title }}</h3>
                <p class="property-price">Rp {{ number_format($property->price_monthly, 0, ',', '.') }}/bln</p>
                <p class="property-area">📍 {{ $property->area }}</p>
            </a>
            @endforeach

            <div style="text-align: center;">
                <a href="https://manokos.id/cari" class="btn">Lihat Semua Properti</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 Manokos Jambi. Semua Hak Dilindungi.</p>
            <p>Anda menerima email ini karena Anda berlangganan notifikasi kawasan favorit di Manokos.</p>
            <p>
                <a href="https://manokos.id/api/unsubscribe?token={{ $unsubscribeToken }}" class="unsubscribe">Berhenti berlangganan</a> | 
                <a href="https://manokos.id/akun" class="unsubscribe">Pengaturan Akun</a>
            </p>
        </div>
    </div>
</body>
</html>
