import { z } from 'zod'
import { type EpicMeMCP } from './index.ts'
import { invariant } from '@epic-web/invariant'

export async function initializePrompts(agent: EpicMeMCP) {
	agent.server.registerPrompt(
		'suggest_tags',
		{
			title: 'Suggest Tags',
			description: 'Suggest tags for a journal entry',
			argsSchema: {
				entryId: z
					.string()
					.describe('The ID of the journal entry to suggest tags for'),
			},
		},
		async ({ entryId }) => {
			// 🐨 get the entry and tags from the database
			const entry = await agent.db.getEntry(Number(entryId))

			const tags = await agent.db.listTags()
			invariant(entry, `entry with the ID "${entryId}" not found`)
			
			// 💰 const tags = await agent.db.listTags()
			// 💯 As extra credit, add some validation to make sure the entryId is a
			// valid number and the entry exists (you can use the invariant function
			// from @epic-web/invariant)

			return {
				messages: [
					{
						role: 'user',
						content: {
							type: 'text',
							text: `
Below is my EpicMe journal entry with ID "${entryId}" and the tags I have available.

Please suggest some tags to add to it. Feel free to suggest new tags I don't have yet.

For each tag I approve, if it does not yet exist, create it with the EpicMe "create_tag" tool. Then add approved tags to the entry with the EpicMe "add_tag_to_entry" tool.
								`.trim(),
						},
					},
					{
						role: 'user',
						content: {
							type: 'resource',
							resource: {
								uri: 'epicme://tags',
								mimeType: 'application/json',
								text: JSON.stringify(tags),
							},
						},
					},
					{
						role: 'user',
						content: {
							type: 'resource',
							resource: {
								uri: `epicme://entries/${entryId}`,
								mimeType: 'application/json',
								text: JSON.stringify(entry),
							},
						},
					},
				],
			}
		},
	)
}
