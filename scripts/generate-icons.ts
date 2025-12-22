/**
 * Script to generate PWA icons from SVG
 *
 * Run with: npx tsx scripts/generate-icons.ts
 * Requires: npm install -D sharp @types/sharp
 */

import sharp from 'sharp'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const SIZES = [32, 72, 96, 128, 144, 152, 180, 192, 384, 512]
const INPUT_SVG = join(__dirname, '../public/icon.svg')
const OUTPUT_DIR = join(__dirname, '../public/icons')

async function generateIcons() {
  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const svgBuffer = readFileSync(INPUT_SVG)

  console.log('🎨 Generating PWA icons...')

  for (const size of SIZES) {
    const outputPath = join(OUTPUT_DIR, `icon-${size}x${size}.png`)

    await sharp(svgBuffer).resize(size, size).png().toFile(outputPath)

    console.log(`  ✅ Generated ${size}x${size}`)
  }

  // Generate maskable icon (with padding for safe area)
  const maskableSize = 512
  const padding = Math.floor(maskableSize * 0.1) // 10% padding
  const innerSize = maskableSize - padding * 2

  const maskablePath = join(
    OUTPUT_DIR,
    `icon-maskable-${maskableSize}x${maskableSize}.png`
  )

  // Create maskable icon with background and padding
  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(svgBuffer).resize(innerSize, innerSize).toBuffer(),
        top: padding,
        left: padding,
      },
    ])
    .png()
    .toFile(maskablePath)

  console.log(`  ✅ Generated maskable-${maskableSize}x${maskableSize}`)

  console.log('\n✨ All icons generated successfully!')
  console.log(`   Output: ${OUTPUT_DIR}`)
}

generateIcons().catch(console.error)
