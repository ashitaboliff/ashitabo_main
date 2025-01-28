/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		tailwindcss: {},
	},
	api: {
		bodyParser: false,
		externalResolver: true,
		responseLimit: false,
	},
}

export default config
