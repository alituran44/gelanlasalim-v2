import os
from PIL import Image, ImageOps

def create_mobile_assets():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logo_path = os.path.join(base_dir, 'public', 'logo-icon.png')
    
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found.")
        return

    icon = Image.open(logo_path).convert('RGBA')
    bg_color = (15, 34, 61, 255) # #0F223D

    # 1. PWA Icons in public/
    pwa_sizes = {
        'pwa-192x192.png': (192, 192),
        'pwa-512x512.png': (512, 512),
        'apple-touch-icon.png': (180, 180),
        'android-chrome-192x192.png': (192, 192),
        'android-chrome-512x512.png': (512, 512)
    }
    for filename, size in pwa_sizes.items():
        out_path = os.path.join(base_dir, 'public', filename)
        resized = icon.resize(size, Image.Resampling.LANCZOS)
        resized.save(out_path, format='PNG')
        print(f"Generated PWA icon: {filename}")

    # Maskable PWA icon (padded 15%)
    maskable = Image.new('RGBA', (512, 512), bg_color)
    padded_icon = icon.resize((360, 360), Image.Resampling.LANCZOS)
    maskable.paste(padded_icon, (76, 76), padded_icon)
    maskable.save(os.path.join(base_dir, 'public', 'maskable-icon-512x512.png'), format='PNG')
    print("Generated maskable-icon-512x512.png")

    # 2. iOS AppIcon (1024x1024)
    ios_icon_dir = os.path.join(base_dir, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset')
    if os.path.exists(ios_icon_dir):
        ios_icon = Image.new('RGBA', (1024, 1024), bg_color)
        scaled_icon = icon.resize((820, 820), Image.Resampling.LANCZOS)
        ios_icon.paste(scaled_icon, (102, 102), scaled_icon)
        # Convert to RGB as required by App Store
        ios_icon_rgb = Image.new('RGB', (1024, 1024), (15, 34, 61))
        ios_icon_rgb.paste(ios_icon, (0, 0), ios_icon)
        ios_icon_rgb.save(os.path.join(ios_icon_dir, 'AppIcon-512@2x.png'), format='PNG')
        print("Generated iOS 1024x1024 AppIcon-512@2x.png")

    # 3. Android Mipmap Icons
    android_res_dir = os.path.join(base_dir, 'android', 'app', 'src', 'main', 'res')
    android_densities = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192
    }

    for folder, size in android_densities.items():
        target_dir = os.path.join(android_res_dir, folder)
        if not os.path.exists(target_dir):
            continue
        
        # Standard launcher icon
        res_icon = Image.new('RGBA', (size, size), bg_color)
        inner_size = int(size * 0.8)
        offset = (size - inner_size) // 2
        scaled = icon.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
        res_icon.paste(scaled, (offset, offset), scaled)
        res_icon.save(os.path.join(target_dir, 'ic_launcher.png'), format='PNG')

        # Round launcher icon
        res_icon.save(os.path.join(target_dir, 'ic_launcher_round.png'), format='PNG')

        # Foreground for adaptive icons (padded)
        fg_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        fg_size = int(size * 0.65)
        fg_offset = (size - fg_size) // 2
        fg_scaled = icon.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
        fg_icon.paste(fg_scaled, (fg_offset, fg_offset), fg_scaled)
        fg_icon.save(os.path.join(target_dir, 'ic_launcher_foreground.png'), format='PNG')
        print(f"Generated Android icons for {folder}")

    # 4. Splash Screens for Android
    splash_targets = [
        ('drawable', (480, 800)),
        ('drawable-land-mdpi', (480, 320)),
        ('drawable-land-hdpi', (800, 480)),
        ('drawable-land-xhdpi', (1280, 720)),
        ('drawable-land-xxhdpi', (1600, 960)),
        ('drawable-land-xxxhdpi', (1920, 1280)),
        ('drawable-port-mdpi', (320, 480)),
        ('drawable-port-hdpi', (480, 800)),
        ('drawable-port-xhdpi', (720, 1280)),
        ('drawable-port-xxhdpi', (960, 1600)),
        ('drawable-port-xxxhdpi', (1280, 1920))
    ]

    for folder, (w, h) in splash_targets:
        target_dir = os.path.join(android_res_dir, folder)
        if not os.path.exists(target_dir):
            continue
        splash = Image.new('RGB', (w, h), (15, 34, 61))
        # Place logo in center, max 40% of min dimension
        logo_max = int(min(w, h) * 0.35)
        splash_logo = icon.resize((logo_max, logo_max), Image.Resampling.LANCZOS)
        pos = ((w - logo_max) // 2, (h - logo_max) // 2)
        splash.paste(splash_logo, pos, splash_logo)
        splash.save(os.path.join(target_dir, 'splash.png'), format='PNG')
        print(f"Generated Splash screen for {folder} ({w}x{h})")

    print("\nAll mobile assets successfully generated!")

if __name__ == '__main__':
    create_mobile_assets()
