#!/usr/bin/env python3
"""
PDF 图片提取工具 - 从花生笔记 PDF 中提取图片并生成知识点映射
用法:
  python3 scripts/extract-pdf-images.py <PDF文件路径> [--module graphic|data-analysis|quantity|logic|verbal] [--output-dir output/images]

功能:
  1. 将 PDF 每页渲染为高清图片
  2. 自动压缩转 WebP（优先）或 JPEG
  3. 生成知识点映射表（JSON格式），方便后续填充到数据模型
  4. 输出可直接上传到微信云存储的目录结构

依赖: macOS 自带 sips + qlmanage，Python3 + Pillow
"""

import os
import sys
import json
import argparse
import subprocess
import shutil
from pathlib import Path

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

# 微信小程序标准宽度 750rpx 对应 2x 分辨率
MAX_WIDTH = 1500
# WebP 压缩质量
QUALITY = 80
# JPEG 备用质量
JPEG_QUALITY = 85


def pdf_to_images(pdf_path, output_dir, dpi=200):
    """将 PDF 每页转为图片（使用 macOS 原生工具）"""
    page_images = []

    # 方法1: 使用 qlmanage 渲染 PDF 缩略图
    tmp_dir = os.path.join(output_dir, '_tmp_pages')
    os.makedirs(tmp_dir, exist_ok=True)

    print(f"📄 正在渲染 PDF: {os.path.basename(pdf_path)}")

    # 用 qlmanage 生成整页预览
    cmd = ['qlmanage', '-t', '-s', str(MAX_WIDTH), '-o', tmp_dir, pdf_path]
    result = subprocess.run(cmd, capture_output=True, timeout=60)

    # qlmanage 生成的文件名通常是 <basename>.png
    basename = os.path.splitext(os.path.basename(pdf_path))[0]

    # 检查生成的图片
    for f in sorted(os.listdir(tmp_dir)):
        if f.endswith('.png') or f.endswith('.jpg'):
            page_images.append(os.path.join(tmp_dir, f))

    if not page_images:
        # 方法2: 用 sips 转换（macOS 原生）
        print("  qlmanage 未生成图片，尝试 sips 方式...")
        # sips 不直接支持 PDF，但可以处理已渲染的页面
        pass

    return page_images, tmp_dir


def compress_image(src_path, dest_path, max_width=MAX_WIDTH):
    """压缩并转换图片格式（优先 WebP）"""
    if HAS_PIL:
        img = Image.open(src_path)
        # 缩放到合理宽度
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        # 尝试保存为 WebP
        webp_path = os.path.splitext(dest_path)[0] + '.webp'
        try:
            img.save(webp_path, 'WEBP', quality=QUALITY)
            orig_size = os.path.getsize(src_path)
            new_size = os.path.getsize(webp_path)
            saved = (orig_size - new_size) * 100 // (orig_size + 1)
            print(f"  ✅ {os.path.basename(src_path)} → {os.path.basename(webp_path)} "
                  f"({orig_size//1024}KB → {new_size//1024}KB, 节省{saved}%)")
            return webp_path
        except Exception as e:
            # WebP 保存失败，回退 JPEG
            jpeg_path = os.path.splitext(dest_path)[0] + '.jpg'
            img.save(jpeg_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
            print(f"  ⚠️  WebP 失败，转 JPEG: {os.path.basename(jpeg_path)} ({e})")
            return jpeg_path
    else:
        # 没有 PIL，用 sips
        subprocess.run(['sips', '--resampleWidth', str(max_width),
                        src_path, '--out', dest_path], capture_output=True)
        jpeg_path = os.path.splitext(dest_path)[0] + '.jpg'
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions',
                        str(JPEG_QUALITY), src_path, '--out', jpeg_path],
                       capture_output=True)
        print(f"  ✅ {os.path.basename(src_path)} → {os.path.basename(jpeg_path)} (sips)")
        return jpeg_path


def extract_page_regions(page_image, module='graphic'):
    """
    从单页图片中识别和裁剪内容区域
    当前版本：返回整页图片（后续可加智能裁剪）
    """
    # TODO: 后续可加 OCR 区域检测，自动裁剪独立图片块
    # 当前先用整页，用户可手动裁剪
    return [page_image]


def generate_mapping(images_output_dir, module):
    """生成知识点-图片映射表"""
    mapping = {}

    # 按文件名排序，生成 page_01, page_02 ...
    image_files = sorted([
        f for f in os.listdir(images_output_dir)
        if f.endswith(('.webp', '.jpg', '.png')) and not f.startswith('.')
    ])

    for i, img_file in enumerate(image_files, 1):
        key = f"page_{i:02d}"
        mapping[key] = {
            "file": img_file,
            "module": module,
            "cloud_path": f"{module}/{img_file}",
            "status": "待确认知识点关联",
            "suggested_points": []
        }

    return mapping


def main():
    parser = argparse.ArgumentParser(description='PDF 图片提取工具')
    parser.add_argument('pdf_path', help='PDF 文件路径')
    parser.add_argument('--module', default='graphic',
                        choices=['graphic', 'data-analysis', 'quantity', 'logic', 'verbal'],
                        help='模块名称（用于目录结构和映射）')
    parser.add_argument('--output-dir', default='output/images',
                        help='输出目录')
    parser.add_argument('--dpi', type=int, default=200,
                        help='渲染 DPI（默认 200）')
    parser.add_argument('--full-page', action='store_true',
                        help='整页渲染模式（默认裁剪内容区域）')

    args = parser.parse_args()

    pdf_path = os.path.abspath(args.pdf_path)
    if not os.path.exists(pdf_path):
        print(f"❌ 文件不存在: {pdf_path}")
        sys.exit(1)

    output_dir = os.path.abspath(args.output_dir)
    module_dir = os.path.join(output_dir, args.module)
    os.makedirs(module_dir, exist_ok=True)

    print("=" * 50)
    print("🖼️  PDF 图片提取工具")
    print(f"   PDF: {os.path.basename(pdf_path)}")
    print(f"   模块: {args.module}")
    print(f"   输出: {module_dir}")
    print("=" * 50)
    print()

    # Step 1: 渲染 PDF 页面为图片
    page_images, tmp_dir = pdf_to_images(pdf_path, module_dir, args.dpi)

    if not page_images:
        print("❌ 未能从 PDF 中提取任何图片")
        print("   提示: 确保 PDF 文件可正常打开")
        sys.exit(1)

    print(f"📑 共渲染 {len(page_images)} 页")
    print()

    # Step 2: 压缩和格式转换
    print("📦 压缩和格式转换:")
    final_images = []
    for i, page_img in enumerate(page_images, 1):
        dest_base = f"page_{i:02d}"
        dest_path = os.path.join(module_dir, dest_base + '.png')
        compressed = compress_image(page_img, dest_path)
        final_images.append(compressed)

    # Step 3: 清理临时文件
    if os.path.exists(tmp_dir):
        shutil.rmtree(tmp_dir)

    # Step 4: 生成映射表
    print()
    print("📋 生成知识点-图片映射表:")
    mapping = generate_mapping(module_dir, args.module)

    mapping_file = os.path.join(module_dir, 'image-mapping.json')
    with open(mapping_file, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)

    print(f"  映射表已保存: {mapping_file}")
    print()

    # Step 5: 输出使用指引
    print("=" * 50)
    print("✅ 提取完成！")
    print()
    print("📌 后续步骤:")
    print(f"  1. 检查 {module_dir}/ 中的图片质量")
    print(f"  2. 编辑 image-mapping.json，为每张图片指定知识点关联")
    print(f"  3. 运行压缩: bash scripts/compress-images.sh {module_dir}")
    print(f"  4. 上传到云存储后，将路径填入对应数据模型的 image-note 块")
    print()
    print(f"💡 快速上传方式:")
    print(f"   - 在微信开发者工具中打开云开发控制台")
    print(f"   - 上传 {args.module}/ 目录下的所有图片")
    print(f"   - 云存储路径前缀: note-resources/{args.module}/")
    print("=" * 50)


if __name__ == '__main__':
    main()
