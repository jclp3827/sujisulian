#!/usr/bin/env python3
"""Generate review helpers for graphic-note PDF page candidates."""

import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


GRID_COLOR = (214, 47, 39, 180)
LABEL_COLOR = (214, 47, 39, 255)
GUIDE_COLOR = (30, 96, 170, 120)
BACKGROUND = (255, 255, 255)


def parse_box(value):
    parts = [int(part.strip()) for part in value.split(",")]
    if len(parts) != 4:
        raise argparse.ArgumentTypeError("box must be x1,y1,x2,y2")
    x1, y1, x2, y2 = parts
    if x2 <= x1 or y2 <= y1:
        raise argparse.ArgumentTypeError("box coordinates must increase")
    return x1, y1, x2, y2


def font(size=14):
    try:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", size)
    except OSError:
        return ImageFont.load_default()


def add_grid(src, out, step):
    image = Image.open(src).convert("RGBA")
    overlay = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    label_font = font(12)

    width, height = image.size
    for x in range(0, width + 1, step):
        color = GRID_COLOR if x % (step * 2) else GUIDE_COLOR
        draw.line((x, 0, x, height), fill=color, width=1)
        draw.text((x + 2, 2), str(x), fill=LABEL_COLOR, font=label_font)
    for y in range(0, height + 1, step):
        color = GRID_COLOR if y % (step * 2) else GUIDE_COLOR
        draw.line((0, y, width, y), fill=color, width=1)
        draw.text((2, y + 2), str(y), fill=LABEL_COLOR, font=label_font)

    out.parent.mkdir(parents=True, exist_ok=True)
    Image.alpha_composite(image, overlay).convert("RGB").save(out)


def crop(src, out, box):
    image = Image.open(src).convert("RGB")
    width, height = image.size
    x1, y1, x2, y2 = box
    if x1 < 0 or y1 < 0 or x2 > width or y2 > height:
        raise ValueError(f"box {box} outside image bounds {(width, height)}")
    out.parent.mkdir(parents=True, exist_ok=True)
    image.crop(box).save(out)


def contact_sheet(images, out, columns, tile_width, padding):
    loaded = []
    caption_font = font(14)
    for path in images:
        img = Image.open(path).convert("RGB")
        ratio = tile_width / img.width
        tile_height = max(1, math.ceil(img.height * ratio))
        img = img.resize((tile_width, tile_height), Image.LANCZOS)
        loaded.append((path, img))

    if not loaded:
        raise ValueError("no images supplied")

    caption_height = 28
    rows = math.ceil(len(loaded) / columns)
    row_heights = []
    for row in range(rows):
        row_items = loaded[row * columns:(row + 1) * columns]
        row_heights.append(max(img.height for _, img in row_items) + caption_height)

    sheet_width = columns * tile_width + (columns + 1) * padding
    sheet_height = sum(row_heights) + (rows + 1) * padding
    sheet = Image.new("RGB", (sheet_width, sheet_height), BACKGROUND)
    draw = ImageDraw.Draw(sheet)

    y = padding
    for row in range(rows):
        x = padding
        row_items = loaded[row * columns:(row + 1) * columns]
        for path, img in row_items:
            sheet.paste(img, (x, y + caption_height))
            draw.text((x, y), path.name, fill=(36, 36, 36), font=caption_font)
            x += tile_width + padding
        y += row_heights[row] + padding

    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    grid_parser = subparsers.add_parser("grid")
    grid_parser.add_argument("src", type=Path)
    grid_parser.add_argument("out", type=Path)
    grid_parser.add_argument("--step", type=int, default=50)

    crop_parser = subparsers.add_parser("crop")
    crop_parser.add_argument("src", type=Path)
    crop_parser.add_argument("out", type=Path)
    crop_parser.add_argument("--box", type=parse_box, required=True)

    sheet_parser = subparsers.add_parser("sheet")
    sheet_parser.add_argument("out", type=Path)
    sheet_parser.add_argument("images", type=Path, nargs="+")
    sheet_parser.add_argument("--columns", type=int, default=3)
    sheet_parser.add_argument("--tile-width", type=int, default=260)
    sheet_parser.add_argument("--padding", type=int, default=18)

    args = parser.parse_args()
    if args.command == "grid":
        add_grid(args.src, args.out, args.step)
    elif args.command == "crop":
        crop(args.src, args.out, args.box)
    elif args.command == "sheet":
        contact_sheet(args.images, args.out, args.columns, args.tile_width, args.padding)


if __name__ == "__main__":
    main()
