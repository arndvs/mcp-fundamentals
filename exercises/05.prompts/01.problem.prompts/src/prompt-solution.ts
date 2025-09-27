// 💰 you'll need this for the argument schema
import { z } from 'zod'
import { type EpicMeMCP } from './index.ts'

export async function initializePrompts(agent: EpicMeMCP) {

// 🐨 use agent.server.registerPrompt to create a prompt here called "suggest_tags" with a reasonable title and description
	agent.server.registerPrompt(
		// uniq id for the prompt
		'suggest_tags',
		{
			title: 'Suggest Tags',
			description: 'Suggest tags for a journal entry',
			// 🐨 it should take an entryId as an argument (with argsSchema)
			// has to be a string
			argsSchema: { entryId: z.string()},
		},
		
		async ({entryId}) => {
			return {
				// 🐨 the callback should return a prompt message that instructs the assistant to:
				messages: [
					{
						role: 'user',
						content: { type: 'text',
						// - lookup the journal entry with the given ID (tell it to use the get_entry tool)
						// - look up the available tags (tell it to use the list_tags tool)
						// - suggest tags (creating new ones if necessary)
						// - for approved tags, tell it to create new ones (tell it to use the create_tag tool)
						//   and then add them to the entry (tell it to use the add_tag_to_entry tool)
						text: 
`
Please look up the journal entry with the ID of ${entryId}(tell it to use the get_entry tool)
Please look up the available tags (tell it to use the list_tags tool)
Please suggest tags (creating new ones if necessary)
Please suggest tags (creating new ones if necessary)
Please create new tags if necessary (tell it to use the create_tag tool)
Please add approved tags to the entry (tell it to use the add_tag_to_entry tool)
` },
					},
				],
			}
		},
	)
}
			
