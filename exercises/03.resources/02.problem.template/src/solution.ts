// 💰 you'll use both of these in this exercise:
import { invariant } from '@epic-web/invariant'
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

import { type EpicMeMCP } from './index.ts'

export async function initializeResources(agent: EpicMeMCP) {
	agent.server.registerResource(
		'tags',
		'epicme://tags',
		{
			title: 'Tags',
			description: 'All tags currently in the database',
		},
		async (uri) => {
			const tags = await agent.db.getTags()
			return {
				contents: [
					{
						mimeType: 'application/json',
						text: JSON.stringify(tags),
						uri: uri.toString(),
					},
				],
			}
		},
	),

	// 🐨 the ResourceTemplate for each should set the "list" property to "undefined" for now
	// 🐨 each should have a title and description
	// 🐨 each should have a callback that reads the entry or tag for the given id
	// 🐨 return contents with mimeType application/json and the entry or tag
	// 💯 as extra credit, handle the case where the id is not found (you can use invariant for this)
	
	// 🐨 create two resources with a ResourceTemplate:
	agent.server.registerResource(
		//entry 
		'entry',
		// ResourceTemplate URI: epicme://entries/{id} 
		new ResourceTemplate('epicme://entries/{id}', {
			// this is required to be specified, but we'll implement it later...
			list: undefined,
		}),
		{
			// title and description
			title: 'Entry',
			description: 'A single entry with the given ID',
		},
		async (uri, { id }) => {
			invariant(typeof id === 'string', 'id is required')
			const idNumber = Number(id)
			invariant(!isNaN(idNumber), 'id must be a number')
			//(💰 use await agent.db.getEntry)
			const entry = await agent.db.getEntry(idNumber)
			// if (!entry) {
			// 	throw new Error(`Entry with ID "${idNumber}" not found`)
			// }
			return {
				contents: [
					{
						mimeType: 'application/json',
						text: JSON.stringify(entry),
						uri: uri.toString(),
					},
				],
			}
		},
	),

	agent.server.registerResource(
		// - tag 
		'tag',
		// ResourceTemplate URI: epicme://tags/{id} 
		new ResourceTemplate('epicme://tags/{id}', {
			list: undefined,
		}),
		{
			title: 'Tag',
			description: 'A single tag with the given ID',
		},
		async (uri, { id }) => {
			invariant(typeof id === 'string', 'id is required')
			const idNumber = Number(id)
			invariant(!isNaN(idNumber), 'id must be a number')
			//(💰 use await agent.db.getTag)
			const tag = await agent.db.getTag(idNumber)
			invariant(tag, `Tag with ID "${idNumber}" not found`)
			return {
				contents: [
					{
						mimeType: 'application/json',
						text: JSON.stringify(tag),
						uri: uri.toString(),
					},
				],
			}
		},
	)
}
	





