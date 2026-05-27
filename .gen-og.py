"""Generate the 1200x630 OG social image."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (243, 237, 226)        # --bg
BG2 = (235, 227, 212)       # --bg-2
INK = (26, 23, 20)          # --ink
INK2 = (58, 52, 45)         # --ink-2
INK3 = (107, 99, 87)        # --ink-3
LINE = (217, 207, 189)      # --line
ACCENT = (194, 65, 12)      # --accent

serif = lambda s: ImageFont.truetype(".fonts/InstrumentSerif.ttf", s)
serif_it = lambda s: ImageFont.truetype(".fonts/InstrumentSerif-Italic.ttf", s)
mono = lambda s: ImageFont.truetype(".fonts/JetBrainsMono-Regular.ttf", s)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# --- Portrait card on the right ---
# 4:5 frame, height ~ 470, width = 376, right padding 72
ph = 470
pw = int(ph * 4 / 5)  # 376
px = W - 72 - pw      # 752
py = (H - ph) // 2    # 80

# Accent corner behind frame (offset bottom-left)
d.rectangle([px - 12, py + ph - 52, px - 12 + 64, py + ph - 52 + 64], fill=ACCENT)

# Frame background
d.rectangle([px, py, px + pw, py + ph], fill=BG2, outline=LINE, width=1)

# Portrait (cover-fit, object-position center 22%)
portrait = Image.open("assets/rohan-portrait.png").convert("RGB")
sw, sh = portrait.size
scale = max(pw / sw, ph / sh)
nw, nh = int(sw * scale), int(sh * scale)
portrait = portrait.resize((nw, nh), Image.LANCZOS)
# object-position center 22% -> crop with vertical bias
crop_x = (nw - pw) // 2
crop_y = max(0, int(nh * 0.22) - ph // 2)
crop_y = min(crop_y, nh - ph)
portrait = portrait.crop((crop_x, crop_y, crop_x + pw, crop_y + ph))
img.paste(portrait, (px, py))

# Subtle bottom gradient overlay on portrait (ties into cream)
overlay = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
for i in range(int(ph * 0.4)):
    a = int(i / (ph * 0.4) * 60)
    od.line([(0, ph - 1 - i), (pw, ph - 1 - i)], fill=(243, 237, 226, a))
img.paste(overlay, (px, py), overlay)

# --- Left content column ---
left_x = 72
top_y = 96

# Eyebrow: bar + label
bar_y = top_y + 8
d.rectangle([left_x, bar_y, left_x + 32, bar_y + 1], fill=INK3)
d.text((left_x + 44, top_y), "ROHAN KUMAR  ·  MUMBAI", font=mono(15), fill=INK3)

# Headline
hl_x = left_x
hl_y = top_y + 56
hl_font = serif(82)
line_gap = 78
d.text((hl_x, hl_y), "I ship", font=hl_font, fill=INK)
d.text((hl_x, hl_y + line_gap), "products", font=hl_font, fill=INK)
# "that " (ink) + "scales." (accent italic)
d.text((hl_x, hl_y + line_gap * 2), "that ", font=hl_font, fill=INK)
that_w = d.textlength("that ", font=hl_font)
d.text((hl_x + that_w, hl_y + line_gap * 2), "scales.", font=serif_it(82), fill=ACCENT)

# Sub-label at bottom: role + dot
sub_y = H - 96
# accent dot
d.ellipse([left_x, sub_y + 6, left_x + 10, sub_y + 16], fill=ACCENT)
d.text((left_x + 22, sub_y), "Senior PM × AI Builder  ·  Axis Bank", font=mono(16), fill=INK2)
d.text((left_x, sub_y + 28), "₹6,000 Cr GMV  ·  2M+ users migrated  ·  7 AI products shipped solo", font=mono(13), fill=INK3)

# Top hairline frame
d.rectangle([0, 0, W, 4], fill=ACCENT)

img.save("assets/og-image.png", "PNG", optimize=True)
print("wrote assets/og-image.png", img.size)
