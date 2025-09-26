import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer(
	{
		name: 'epicme',
		title: 'EpicMe',
		version: '1.0.0',
	},
	{
		capabilities: {
			tools: {},
		},
		instructions: 'This lets you solve math problems.',
	},
)

server.registerTool(
	'add',
	{
		title: 'Add',
		// 🐨 update the description to indicate this adds any two numbers
		description: 'Adds any two numbers together',
		// 🐨 add an inputSchema object with a firstNumber and secondNumber property
		// 📜 These should be zod schemas https://zod.dev/
		// 💯 add descriptions for the llm to know what they're for
		inputSchema: {
			
			firstNumber: z.number().describe('The first number to add'),
			secondNumber: z.number().describe('The second number to add'),
			email: z.string().email().describe('The email to send the message to'),
			name: z.string().describe('The name of the user'),
		},
	},
	// 🐨 accept an object parameter with a firstNumber and secondNumber property
	async ({ firstNumber, secondNumber, email, name }) => {
		return {
			content: [
				{
					type: 'text',
					// 🐨 use the firstNumber and secondNumber properties to return the sum
					text: `The sum of ${firstNumber} and ${secondNumber} is ${firstNumber + secondNumber}. ${email ? `The email is ${email}.` : ''} ${name ? `The name is ${name}.` : ''}`,
				},
			],
		}
	},
)

async function main() {
	const transport = new StdioServerTransport()
	await server.connect(transport)
	console.error('EpicMe MCP Server running on stdio')
}

main().catch((error) => {
	console.error('Fatal error in main():', error)
	process.exit(1)
})
