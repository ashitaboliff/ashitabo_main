// import { Handler } from '@netlify/functions'
// import { LocalUpdateBuyStateFunction } from './LocalUpdateBuyStateFunction'

// export const handler: Handler = async (event, context) => {
// 	try {
// 		await LocalUpdateBuyStateFunction()
// 		return {
// 			statusCode: 200,
// 			body: JSON.stringify({
// 				message: 'Expired records updated successfully.',
// 			}),
// 		}
// 	} catch (error) {
// 		console.error('Error updating expired records:', error)
// 		return {
// 			statusCode: 500,
// 			body: JSON.stringify({ error: 'Failed to update expired records.' }),
// 		}
// 	}
// }
