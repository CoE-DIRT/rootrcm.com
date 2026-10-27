from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageOps

original = Path('docs/website/baseline/screens')
target = Path('docs/website/ux-1-1/screens')
for size in ['1920x1080', '390x844']:
    for mode in ['light', 'dark']:
        filename = f'home__{size}__{mode}'
        before = Image.open(original / (filename + '.png')).convert('RGB')
        after = Image.open(target / (filename + '__after.png')).convert('RGB')
        max_w = max(before.width, after.width)
        max_h = max(before.height, after.height)
        before_canvas = Image.new('RGB', (max_w, max_h), '#F4F7FB')
        after_canvas = Image.new('RGB', (max_w, max_h), '#F4F7FB')
        before_canvas.paste(before, (0,0))
        after_canvas.paste(after, (0,0))
        difference = ImageChops.difference(before_canvas, after_canvas)
        mask = difference.convert('L').point(lambda pixel: 255 if pixel > 24 else 0)
        red = Image.new('RGB', (max_w,max_h), '#E34F61')
        overlay = Image.blend(after_canvas, red, 0.30)
        after_highlight = Image.composite(overlay, after_canvas, mask)
        max_col = 960 if max_w > 1000 else max_w
        ratio = max_col / max_w
        out_w = int(max_w*ratio)
        out_h = int(max_h*ratio)
        left = before_canvas.resize((out_w,out_h))
        right = after_highlight.resize((out_w,out_h))
        panel = Image.new('RGB',(out_w*2+24,out_h+65),'#E8EDF5')
        panel.paste(left,(0,64))
        panel.paste(right,(out_w+24,64))
        draw=ImageDraw.Draw(panel)
        draw.text((12,16), 'BEFORE: UX-0.2 baseline', fill='#0B1F3A')
        draw.text((out_w+36,16), 'AFTER: UX-1.1 (red tint = changed pixels)', fill='#0B1F3A')
        panel.save(target / (filename + '__diff.png'), optimize=True)
        print(filename, 'new screenshots and highlighted before/after panel')
