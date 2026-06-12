#!/bin/bash
# 图片压缩脚本 - 上传前自动压缩转 WebP 格式
# 用法: bash scripts/compress-images.sh <输入目录> [输出目录]
# 依赖: cwebp (Google WebP 编码器)、sips (macOS 内置)
# 安装 cwebp: brew install webp

set -e

INPUT_DIR="${1:?用法: bash scripts/compress-images.sh <输入目录> [输出目录]}"
OUTPUT_DIR="${2:-$INPUT_DIR/output}"

# 目标最大宽度（小程序标准宽度 750px 对应 2x 为 1500px）
MAX_WIDTH=1500
# WebP 压缩质量 (0-100, 推荐 75-85)
QUALITY=80

mkdir -p "$OUTPUT_DIR"

compress_png_jpg() {
  local src="$1"
  local basename=$(basename "$src")
  local name="${basename%.*}"
  local dest="$OUTPUT_DIR/${name}.webp"

  # 先用 sips 缩放到合理宽度
  local tmp="/tmp/img_compress_${name}.png"
  cp "$src" "$tmp"
  sips --resampleWidth $MAX_WIDTH "$tmp" --out "$tmp" >/dev/null 2>&1 || true

  # 尝试用 cwebp 转换
  if command -v cwebp &>/dev/null; then
    cwebp -q $QUALITY "$tmp" -o "$dest" 2>/dev/null
    local orig_size=$(stat -f%z "$src" 2>/dev/null || echo 0)
    local new_size=$(stat -f%z "$dest" 2>/dev/null || echo 0)
    if [ "$new_size" -gt 0 ]; then
      local saved=$(( (orig_size - new_size) * 100 / (orig_size + 1) ))
      echo "✅ $basename → ${name}.webp (${orig_size}B → ${new_size}B, 节省${saved}%)"
    fi
    rm -f "$tmp"
  else
    # 没有 cwebp，用 sips 转 JPEG 压缩
    local jpeg_dest="$OUTPUT_DIR/${name}.jpg"
    sips -s format jpeg -s formatOptions 80 "$tmp" --out "$jpeg_dest" >/dev/null 2>&1
    echo "⚠️  cwebp 未安装，转为 JPEG: $basename → ${name}.jpg"
    echo "   安装 cwebp 可获得更好压缩: brew install webp"
    rm -f "$tmp"
  fi
}

echo "🖼️  图片压缩工具"
echo "   输入: $INPUT_DIR"
echo "   输出: $OUTPUT_DIR"
echo "   质量WebP ${QUALITY}% / 最大宽度 ${MAX_WIDTH}px"
echo ""

count=0
for f in "$INPUT_DIR"/*.{png,jpg,jpeg,PNG,JPG,JPEG}; do
  [ -e "$f" ] || continue
  compress_png_jpg "$f"
  count=$((count + 1))
done

if [ $count -eq 0 ]; then
  echo "⚠️  未找到可处理的图片文件"
else
  echo ""
  echo "📊 共处理 $count 张图片"
  echo "💡 上传后记得在 config/assets.js 中填写 CLOUD_IMG_PREFIX"
fi
