# Nano Banana Generate Command Help

The `nanobanana generate` command allows you to generate images with specific styles and variations.

## Usage

`nanobanana generate "your prompt" [options]`

## Valid Options

- `--count=N`: Number of images to generate (1-8, default: 1).
- `--styles="style1,style2"`: Comma-separated list of styles.
    - Valid styles: `photorealistic`, `watercolor`, `oil-painting`, `sketch`, `pixel-art`, `anime`, `vintage`, `modern`, `abstract`, `minimalist`.
- `--variations="var1,var2"`: Comma-separated list of variation types.
    - Valid variations: `lighting`, `angle`, `color-palette`, `composition`, `mood`, `season`, `time-of-day`.
- `--format=grid|separate`: Output format (default: `separate`).
- `--seed=N`: Integer seed for reproducibility.
- `--preview`: Flag to automatically open generated images.

## Example

`nanobanana generate "A futuristic city" --count=2 --styles="photorealistic,modern" --variations="lighting,mood"`
