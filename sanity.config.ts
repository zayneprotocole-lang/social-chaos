/**
 * Sanity Configuration for Deployment
 * With singleton document structure and Presentation preview
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { schema } from './sanity/schemaTypes'

const projectId = 'dmn8ra28'
const dataset = 'production'

// Structure with singleton document for site texts
const structure = (S: any) =>
    S.list()
        .title('Contenu')
        .items([
            // Singleton for site texts
            S.listItem()
                .title('Textes du site')
                .id('siteTexts')
                .child(
                    S.document()
                        .schemaType('siteTexts')
                        .documentId('siteTexts')
                        .title('Textes du site')
                ),
            S.divider(),
            // All other document types
            ...S.documentTypeListItems().filter(
                (listItem: any) => !['siteTexts'].includes(listItem.getId())
            ),
        ])

export default defineConfig({
    name: 'social-chaos',
    title: 'Social Chaos',

    projectId,
    dataset,

    schema,

    plugins: [
        structureTool({ structure }),
        presentationTool({
            previewUrl: {
                origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'https://social-chaos.vercel.app',
                previewMode: {
                    enable: '/api/draft-mode/enable',
                },
            },
        }),
        visionTool({ defaultApiVersion: '2024-01-01' }),
    ],
})
