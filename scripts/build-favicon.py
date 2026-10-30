# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0"]
# ///
"""Build the favicon from the hero photo.

    uv run scripts/build-favicon.py

Writes the App Router metadata files Next turns into <link rel="icon"> and
<link rel="apple-touch-icon"> for every page:

    src/app/icon.png        32×32, circle on transparency
    src/app/favicon.ico     16, 32 and 48, same circle
    src/app/apple-icon.png  180×180, circle on #fafaf8 (opaque; iOS paints
                            transparency black)

They live in src/app/, not a route group and not public/. favicon.ico is only
read at the top of app/, and a file there is the one set of icons both root
layouts ((en), (pt)) and global-not-found inherit. A route-group copy would
also hash the URL.

The crop is the brief Anderson picked: a square from the top-center of
public/hero-photo.webp (horizontally centered, top edge, side = min(width,
height)), masked to a circle. Downscaling is Lanczos so the face survives at
16–32px. Output is byte-for-byte reproducible.
"""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
HERO = ROOT / "public" / "hero-photo.webp"
APP = ROOT / "src" / "app"

# Light-theme page background (--bg in src/app/globals.css). iOS fills a
# transparent apple-touch-icon with black, so the circle sits on this instead.
LIGHT_BG = (0xFA, 0xFA, 0xF8, 255)

ICON_PX = 32
ICO_PX = (16, 32, 48)
APPLE_PX = 180


def square_top_center(image: Image.Image) -> Image.Image:
    """Square from the top edge, centered horizontally."""
    rgba = image.convert("RGBA")
    width, height = rgba.size
    side = min(width, height)
    left = (width - side) // 2
    return rgba.crop((left, 0, left + side, side))


def circle_alpha(side: int, size: int) -> Image.Image:
    """Hard circle at the crop's resolution, then Lanczos down to `size`.

    Masking before the downscale is what antialiases the edge. The ellipse
    stops one pixel inside the bitmap; Pillow treats the right and bottom of
    the box as inclusive, so (0, 0, side, side) would clip the last column.
    """
    mask = Image.new("L", (side, side), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, side - 1, side - 1), fill=255)
    return mask.resize((size, size), Image.Resampling.LANCZOS)


def circular(source: Image.Image, size: int) -> Image.Image:
    square = square_top_center(source)
    # Drop the source alpha instead of compositing on black. The photo's outer
    # pixel is slightly transparent, and convert("RGB") would darken it.
    red, green, blue, _alpha = square.split()
    resized = Image.merge("RGB", (red, green, blue)).resize((size, size), Image.Resampling.LANCZOS)
    resized.putalpha(circle_alpha(square.width, size))
    return resized


def on_light(source: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), LIGHT_BG)
    canvas.alpha_composite(circular(source, size))
    return canvas.convert("RGB")


def write_ico(images: list[Image.Image], path: Path) -> None:
    # Pillow skips any size larger than the image `.save` is called on, so the
    # largest frame has to be the primary one. PNG frames keep the alpha; the
    # BMP path would flatten it.
    largest = max(images, key=lambda image: image.width)
    rest = [image for image in images if image is not largest]
    largest.save(
        path,
        format="ICO",
        sizes=[(image.width, image.height) for image in images],
        append_images=rest,
    )


def main() -> None:
    source = Image.open(HERO)
    icon = circular(source, ICON_PX)
    icon.save(APP / "icon.png", format="PNG", optimize=True)
    write_ico([circular(source, size) for size in ICO_PX], APP / "favicon.ico")
    on_light(source, APPLE_PX).save(APP / "apple-icon.png", format="PNG", optimize=True)
    for name in ("icon.png", "favicon.ico", "apple-icon.png"):
        print(f"wrote {APP / name}")


if __name__ == "__main__":
    main()
