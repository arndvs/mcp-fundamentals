import { type EpicMeMCP } from './index.ts'

export async function initializeResources(agent: EpicMeMCP) {
	
	agent.server.registerResource(
		// 🐨 create a resource called "tags" 
		'tags',
		// with the URI epicme://tags 
		'epicme://tags',
		{
			// - the config object should include a user-facing title 
			title: 'Tags',
			// and an llm-facing description for the resource
			description: 'All tags currently in the database',
		},
		// - the handler accepts the uri
		async (uri) => {
				// `await agent.db.getTags()`
				// 💰 You can use this to get the tags
			const tags = await agent.db.getTags()
			// - returns the contents array which should
			return {
				//   have an object with mimeType application/json, text, and uri
				contents: [
					{
						mimeType: 'application/json',
						text: JSON.stringify(tags),
						uri: uri.toString(),
					},
				],
			}
		},
	)
}
